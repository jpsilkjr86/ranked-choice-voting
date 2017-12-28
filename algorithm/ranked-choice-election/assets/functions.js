// dependencies
// const createResultsHelper = require('./tally/results-helper.js');
const createRunoff = require('./runoff.js');

// retrieves array of candidates who have least number of votes.
// this function can handle tallyData where the values of each candidate key are arrays,
// as well as tallyData where the values of each candidate key are numbers.
function getLeastVotesCandidates(tallyData) {
	// sets lowest as an initially empty array (use `let` so it can be reassigned later)
	let lowest = [];
	// loops through candidates (the keys of tallyData)
	for (let candidate of Object.keys(tallyData)) {
		// if there are no elements in lowest, push the candidate (first iteration)
		if (!lowest.length) {
			lowest.push(candidate);
		}
		// otherwise compare values
		else {
			// temp variables
			let numOfVotesForCurrentCandidate,
				numOfVotesInLowest;
			// ***** IF tallyData[candidate] IS AN ARRAY *****
			if (Array.isArray(tallyData[candidate])) {
				// sets numOfVotes as length of array at tallyData key [candidate]
				numOfVotesForCurrentCandidate = tallyData[candidate].length;
				numOfVotesInLowest = tallyData[lowest[0]].length;
			}
			// ***** IF tallyData[candidate] IS A NUMBER *****
			else {
				// sets numOfVotes as the value of tallyData at key [candidate]
				numOfVotesForCurrentCandidate = tallyData[candidate];
				numOfVotesInLowest = tallyData[lowest[0]];
			}
			// ***** MAIN LOGIC *****
			// if the current candidate has fewer votes than those in lowest array (according to tallyData),
			// then empties lowest array and sets lowest[0] to the current candidate
			if (numOfVotesForCurrentCandidate < numOfVotesInLowest) {
				lowest = [];
				lowest.push(candidate);
			}
			// if the current candidate has the same number of votes as lowest[0],
			// then pushes current candidate onto the lowest array
			else if (numOfVotesForCurrentCandidate == numOfVotesInLowest) {
				lowest.push(candidate);
			}

			// if neither of the above two conditions are true, then just continues loop.
		}
	}
	return lowest;
} // end of getLeastVotesCandidates

// retrieves array of candidates who have most number of votes
function getMostVotesCandidates(tallyData) {
	// sets most as an initially empty array (use `let` so it can be reassigned later)
	let most = [];
	// loops through candidates (the keys of tallyData)
	for (let candidate of Object.keys(tallyData)) {
		// if there are no elements in most, push the candidate (first iteration)
		if (!most.length) {
			most.push(candidate);
		}
		// otherwise compare values
		else {
			// temp variables
			let numOfVotesForCurrentCandidate,
				numOfVotesInMost;
			// ***** IF tallyData[candidate] IS AN ARRAY *****
			if (Array.isArray(tallyData[candidate])) {
				// sets numOfVotes as length of array at tallyData key [candidate]
				numOfVotesForCurrentCandidate = tallyData[candidate].length;
				numOfVotesInMost = tallyData[most[0]].length;
			}
			// ***** IF tallyData[candidate] IS A NUMBER *****
			else {
				// sets numOfVotes as the value of tallyData at key [candidate]
				numOfVotesForCurrentCandidate = tallyData[candidate];
				numOfVotesInMost = tallyData[most[0]];
			}
			// ***** MAIN LOGIC *****
			// if the current candidate has fewer votes than those in 'most' array (according to tallyData),
			// then empties most array and sets most[0] to the current candidate
			if (numOfVotesForCurrentCandidate > numOfVotesInMost) {
				most = [];
				most.push(candidate);
			}
			// if the current candidate has the same number of votes as most[0],
			// then pushes current candidate onto the most array
			else if (numOfVotesForCurrentCandidate == numOfVotesInMost) {
				most.push(candidate);
			}
			// if neither of the above two conditions are true, then just continues loop.
		}
	}
	return most;
} // end of getMostVotesCandidates

function getTotalNumOfVotes(tallyData) {
	// gets the total number of votes by adding together the length of each array
	// of votes held by a candidate (accessed via Object.keys(tallyData)).
	return Object.keys(tallyData).reduce((sum, currentCandidate) => {
		return sum + tallyData[currentCandidate].length;
	}, 0);
}

// checks if any of the candidates has a majority number of votes and, if so, returns the winner.
function getAbsoluteMajorityWinner(tallyData) {
	// saves totalNumOfVotes for descriptiveness
	const totalNumOfVotes = getTotalNumOfVotes(tallyData);
	// loops through tallyData object (the candidate key is a string of the candidate's name.
	// the value at the key is an array of the votes they have.)
	for (let candidate in tallyData) {
		// numOfVotes equals the number of vote elements pushed onto tallyData[candidate]
		const numOfVotesForCandidate = tallyData[candidate].length;
		// if the number of the candidate's votes is over 50% of the total number of ballots cast
		if (( numOfVotesForCandidate / totalNumOfVotes) > .5) {
			// then return the candidate as winner at current tallyData
			return candidate;
		}
	}
	// if the above loop doesn't return a winner, then return null.
	return null;
} // end of getAbsoluteMajorityWinner

function eliminateCandidateFromTally(tallyData, candidate) {
	const copy = JSON.parse(JSON.stringify(tallyData));

	delete copy[candidate];

	return copy;
}

// distributes the incoming votesToDistribute by pushing them into each 
// candidate's array within the tallyData object.
function distributeVotesInTally(tallyData, votesToDistribute) {
	// always copies tallyData to maintain function purity
	const copy = JSON.parse(JSON.stringify(tallyData));
	// loops through votesToDistribute array once
	for (let vote of votesToDistribute) {
		// breaking condition for each vote
		let isTallied = false;
		// loops through ranked vote, breaks if it reaches the end of the
		// vote or if isTallied == true. this will ensure that votes are
		// only tallied for non-eliminated choices.
		for (let j = 0; j < vote.length && !isTallied; j++) {
			// if copy object has property "vote[j]"
			// (i.e. if the choice is still active in the election)
			if (copy.hasOwnProperty(vote[j])) {
				// then push the ranked vote onto the property of copy object
				// that matches the choice at vote[j].
				copy[vote[j]].push(vote)
				isTallied = true;
			}
		} // end of inner for loop
	} // end of for-of loop
	// returns new tally object with votes all distributed
	return copy;
} // end of distributeVotesInTally


// initializeDetailedTally builds structure and initial values of detailed tally object.

// intended structure: {
	
// 	candiatateOne: [~~], // (array holds the ballots counted toward that candidate)
// 	candiatateTwo: [~~],
// 	candiatateThree: [~~],
// 	candiatateFour: [~~]

// } 
function initializeDetailedTally(candidates) {
	// .reduce here operates on the candidates array and returns an object whose
	// keys are set as each element of candidates and whose values are set as empty arrays,
	// which will hold each ranked vote that is counted toward each candidate.
	return candidates.reduce((prev, currentCandidate) => {
		// at each iteration, returns a new object that is combined with the previous iteration's object.
		return Object.assign({}, prev, {[currentCandidate]: []}); // same as ES6+: {...prev, ~~} ?
	}, {}); // initial value is empty object (so .reduce knows what to start building upon)
}

// function for retrieving all ballots by iterating through a tally object
function getAllBallotsInTally(tallyData) {
	// return value
	const ballots = [];	
	// for each candidate key in tallyData
	for (let candidate in tallyData) {
		// for each vote in tha candidate's tally
		for (let vote of tallyData[candidate]) {
			// pushes a copy of the vote array onto ballots
			ballots.push([...vote]);
		}
	}
	// returns ballots at the end
	return ballots;
}

// ********** main algorithm of ranked choice election (recursive) **********
function calculateRankedChoiceTallyResults({ startingTally, votesToCount, roundNum = 1, results = null }) {
	// // if there was no results passed in, then create one.
	// if (!results) {console.log('createResultsHelper', createResultsHelper);
	// 	results = createResultsHelper(Object.keys(startingTally), votesToCount);
	// }
	// sorts votes to active (non-eliminated) candidates who earned them
	const roundTally = distributeVotesInTally(startingTally, votesToCount);
	
	console.log('currentTally at round ' + roundNum + '\n', roundTally);

	// retrieves candidate who has more than 50% of the vote, if exists (if not then returns null)
	const absoluteMajorityWinner = getAbsoluteMajorityWinner(roundTally);

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
	const lowestScoreCandidates = getLeastVotesCandidates(roundTally);
	console.log('lowestScoreCandidates', lowestScoreCandidates, '\n');
	// temp variable
	let eliminated;

	// if there's a tie for the lowest number of votes, proceed to runoff.
	if (lowestScoreCandidates.length > 1) {
		console.log('tie: proceeding to runoff election.', '\n');

		// creates a runoff election
		const runoff = createRunoff(lowestScoreCandidates, getAllBallotsInTally(roundTally));

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
	const tallyAfterElimination = eliminateCandidateFromTally(roundTally, eliminated);

	// the function calls itself recursively, making sure to pass on necessary data to continue calculation.
	return calculateRankedChoiceTallyResults({
		startingTally: tallyAfterElimination, // the next round builds off the tally just after elimination
		votesToCount: votesForEliminated, // sort the votes that belonged to the candidate just eliminated
		roundNum: ++roundNum, // increment the round number
		results: results // pass on the results
	});

} // end of calculateRankedChoiceTallyResults


module.exports = {
	getMostVotesCandidates,
	getLeastVotesCandidates,
	getTotalNumOfVotes,
	getAbsoluteMajorityWinner,
	distributeVotesInTally,
	eliminateCandidateFromTally,
	initializeDetailedTally,
	getAllBallotsInTally,
	calculateRankedChoiceTallyResults
};