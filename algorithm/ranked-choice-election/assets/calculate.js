// dependencies
const createResultsHelper = require('./tally/results-helper.js');
const createRunoff = require('./runoff.js');
const Tally = require('./functions.js');

// ********** main algorithm of ranked choice election (recursive) **********
function calculateRankedChoiceTallyResults({ startingTally, votesToCount, roundNum = 1, results = null }) {
	// if there was no results passed in, then create one.
	if (!results) {
		results = createResultsHelper(Object.keys(startingTally), votesToCount);
	}
	// sorts votes to active (non-eliminated) candidates who earned them
	const roundTally = Tally.distributeVotes(startingTally, votesToCount);
	
	console.log('currentTally at round ' + roundNum + '\n', roundTally);

	// retrieves candidate who has more than 50% of the vote, if exists (if not then returns null)
	const absoluteMajorityWinner = Tally.getAbsoluteMajorityWinner(roundTally);

	// adds round data to the results data
	results.addRoundData({
		roundNum: roundNum,
		winner: absoluteMajorityWinner, // could be null or object
		tally: roundTally
	});

	// if there's an absoluteMajorityWinner, adds it to results data & returns the data (end of calculation)
	if (absoluteMajorityWinner) {
		// sets eliminatedCandidates as an array with any candidate not equal to the absoluteMajorityWinner
		const eliminatedCandidates = Object.keys(roundTally).filter(c => c != absoluteMajorityWinner);
		// adds the winner of the whole election to the results data
		results.addElectionWinner(absoluteMajorityWinner);
		// adds eliminated to the round data
		results.addEliminatedToRoundData(eliminatedCandidates, roundNum);
		// returns the results data (end of calculation)
		return results.getData();
	}

	// *** if the function has reached this point, then there's no absoluteMajorityWinner. next, the
	// function needs to determine a single candidate to eliminate. Logic as follows: ***

	// gets candidates with least number of votes
	// (returns array, which may have 1 or more elements)
	const lowestScoreCandidates = Tally.getLeastVotesCandidates(roundTally);
	console.log('lowestScoreCandidates', lowestScoreCandidates, '\n');
	// temp variable
	let eliminated;

	// if there's a tie for the lowest number of votes, proceed to runoff.
	if (lowestScoreCandidates.length > 1) {
		console.log('tie: proceeding to runoff election.', '\n');

		// creates a runoff election
		const runoff = createRunoff(lowestScoreCandidates, Tally.getAllBallots(roundTally));

		// calculates runoff election results
		const runoffResults = runoff.calculate();

		// adds runoff results to results data at roundNum
		results.addRunoffResultsToRound({ runoffResults, roundNum });

		// sets local variable eliminated to runoffResults.eliminated
		eliminated = runoffResults.eliminated;
	}
	// if there's only one element in lowestScoreCandidates, then set
	// eliminated equal to lowestScoreCandidates[0] (the only element in array).
	else {
		eliminated = lowestScoreCandidates[0];
	}			

	console.log('eliminated', eliminated);

	// adds eliminated to the round data
	results.addEliminatedToRoundData(eliminated, roundNum);

	// *** now that we have obtained a single eliminated candidate, we need to check to see if
	// there are only two candidates left including the eliminated one and, if so, end
	// the function and return the result. ***

	// if there's only one candidate left besides eliminated one
	if (Object.keys(roundTally).length == 2) {
		
		// sets winner as the candidate who has not been eliminated
		const winningCandidate = (
			Object.keys(roundTally)[0] != eliminated
				? Object.keys(roundTally)[0]
				: Object.keys(roundTally)[1]
		);
		// adds the winner of the whole election to the results data
		results.addElectionWinner(winningCandidate);
		// returns the results data (end of calculation)
		return results.getData();
	}

	// if function has reached this point, then it now needs extract all votes counted to the
	// eliminated candidate, remove the eliminated candidate from the candidate pool,
	// and redistribute their votes among the remaining active candidates.

	// extracts votesForEliminated from roundTally at eliminated key (2-level-deep copy)
	const votesForEliminated = roundTally[eliminated].map(vote => [...vote]);
	
	// eliminates candidate with least number of votes from roundTally (deletes property).
	const tallyAfterElimination = Tally.eliminateCandidate(roundTally, eliminated);

	// the function calls itself recursively, making sure to pass on necessary data to continue calculation.
	return calculateRankedChoiceTallyResults({
		startingTally: tallyAfterElimination, // the next round builds off the tally just after elimination
		votesToCount: votesForEliminated, // sort the votes that belonged to the candidate just eliminated
		roundNum: ++roundNum, // increment the round number
		results: results // pass on the results
	});

} // end of calculateRankedChoiceTallyResults

module.exports = calculateRankedChoiceTallyResults;