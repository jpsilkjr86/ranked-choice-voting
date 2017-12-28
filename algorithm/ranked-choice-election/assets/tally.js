// dependencies
const calculateRankedChoiceTallyResults = require('./calculate.js');

// createTally returns an object with methods that have privileged access
// to private variables (achieved by creating a closure)
function createTally(candidatesArg, votesArg) {

	// *************** Private Variables (stored in closure) ***************

	// copies arguments and saves as private variables

	// shallow copy of one-dimensional array
	const _candidates = [...candidatesArg];
	// two-level deep copy of two-dimensional array
	const _votes = votesArg.map(vote => [...vote]);

	// Builds Initial Structure of Object To Be Returned:

	/* Intended strucutre of _tally object: {
	
		candiatateOne: [~~], // (array holds the ballots counted toward that candidate)
		candiatateTwo: [~~],
		candiatateThree: [~~],
		candiatateFour: [~~]

	}   */

	// Solution: use .reduce to build an object by operating on candidates array

	// .reduce here operates on the candidates array and returns an object whose
	// keys are set as each element of candidates and whose values are set as empty arrays,
	// which will hold each ranked vote that is counted toward each candidate.
	const _tally = _candidates.reduce((prev, currentCandidate) => {
		// reduce iterates over each element of candidates and builds an object that
		// consists of previous candidates (key-value pairs of {candidateName: []}) plus
		// {currentCandidate: []}./
		return Object.assign({}, prev, {[currentCandidate]: []}); // same as ES6+: {...prev, ~~} ?
	}, {}); // initial value is empty object (so .reduce knows what to start building upon)

	// ******************************************************************


	// *********************** Private Functions ************************

	// _sortVotes will sort the incoming votes by pushing them into each 
	// candidate's array within the _tally object.
	const _sortVotes = votes => {
		// loops through votes array once
		for (let vote of votes) {
			// breaking condition for each vote
			let isTallied = false;
			// loops through ranked vote, breaks if it reaches the end of the
			// vote or if isTallied == true. this will ensure that votes are
			// only tallied for non-eliminated choices.
			for (let j = 0; j < vote.length && !isTallied; j++) {
				// if _tally object has property "vote[j]"
				// (i.e. if the choice is still active in the election)
				if (_tally.hasOwnProperty(vote[j])) {
					// then push the ranked vote onto the property of _tally object
					// that matches the choice at vote[j].
					_tally[vote[j]].push(vote)
					isTallied = true;
				}
			} // end of inner for loop
		} // end of for-of loop
	}; // end of _sortVotes definition

	const _eliminate = candidate => {
		// deletes eliminated candidate from _tally
		delete _tally[candidate];
	};


	// ************************ Object to Return ************************

	const tallyPrototype = {
		calculate() {
			return calculateRankedChoiceTallyResults({
				startingTally: _tally,
				votesToCount: _votes
			});
		}
	};

	return Object.assign({}, tallyPrototype);

	// ******************************************************************

} // end of createTally

module.exports = createTally;


/*

	// ********** main algorithm of ranked choice election (recursive) **********
	const _processResultsCalculation = function (	// default parameter values:
																				votesToCount = _votes.map(vote => [...vote]),
																				roundNum = 1,
																				results = createResultsHelper(_candidates, _votes) ) {

		// sorts votes to active (non-eliminated) candidates who earned them
		_sortVotes(votesToCount);
		
		console.log('currentTally at round ' + roundNum + '\n', _tally);

		// retrieves candidate who has more than 50% of the vote, if exists (if not then returns null)
		const absoluteMajorityWinner = getAbsoluteMajorityWinner(_tally);

		// adds round data to the results data
		results.addRoundData({
			roundNum: roundNum,
			winner: absoluteMajorityWinner, // could be null or object
			tally: _tally
		});

		// if there's an absoluteMajorityWinner, adds it to results data & returns the data (end of calculation)
		if (absoluteMajorityWinner) {
			// sets eliminatedCandidates as an array with any candidate not equal to the absoluteMajorityWinner
			const eliminatedCandidates = Object.keys(_tally).filter(c => c != absoluteMajorityWinner);
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
		const lowestScoreCandidates = getLeastVotesCandidates(_tally);
		console.log('lowestScoreCandidates', lowestScoreCandidates, '\n');
		// temp variable
		let eliminated;

		// if there's a tie for the lowest number of votes, proceed to runoff.
		if (lowestScoreCandidates.length > 1) {
			console.log('tie: proceeding to runoff election.', '\n');

			// creates a runoff election
			const runoff = createRunoff(lowestScoreCandidates, _votes);

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
		if (Object.keys(_tally).length == 2) {
			
			// sets winner as the candidate who has not been eliminated
			const winningCandidate = (
				Object.keys(_tally)[0] != eliminated
					? Object.keys(_tally)[0]
					: Object.keys(_tally)[1]
			);
			// adds the winner of the whole election to the results data
			results.addElectionWinner(winningCandidate);
			// returns the results data (end of calculation)
			return results.getData();
		}

		// if function has reached this point, then it now needs extract all votes counted to the
		// eliminated candidate, remove the eliminated candidate from the candidate pool,
		// and redistribute their votes among the remaining active candidates.

		// extracts votesForEliminated from _tally at eliminated key (2-level-deep copy)
		const votesForEliminated = _tally[eliminated].map(vote => [...vote]);
		
		// eliminates candidate with least number of votes from _tally (deletes property)
		_eliminate(eliminated);


		// the function calls itself recursively, making sure to pass on results,
		// votesForEliminated and roundNum so as to continue building upon them in the next rounds.
		return _processResultsCalculation(votesForEliminated,
																			++roundNum,
																			results );

	}; // end of _processResultsCalculation

	// ******************************************************************

	*/