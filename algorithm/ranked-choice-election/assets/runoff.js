// dependencies
const createRunoffResultsHelper = require('./runoff/runoff-results-helper.js');
const Tally = require('./functions.js');

// runoff elections are for the purpose of resolving ties between candidates at any point
// in the ranked-choice-election process. it doesn't determine a winner; it determines who
// must be eliminated among the competing candidates -- i.e. whose votes must be redistributed
// among the remaining candidates in the ranked choice election.
function createRunoff (candidatesArg, votesArg) {
	// copies candidatesArg
	const _candidates = [...candidatesArg];
	// copies votesArg (two levels deep)
	const _votes = votesArg.map(vote => [...vote]);

	// private _runoffTally instantiated as an empty object initially.
	const _runoffTally = {};

	/* 	intended struncture of _runoffTally: {
				rank_1_tally: {
					candidate1: X,
					candidate2: X,
					candidate3: X
				},
				rank_2_tally: {
					candidate1: X,
					candidate3: X
				},
				~~
			} 
	*/

	// this function allows us to set up our _runoffTally object to hold data
	// about a particular rank we are tallying. the goal is to dynamically
	// build upon our _runoffTally object to account for any number of iterations
	// through the ranks of the submitted ballots, so that no more and no less
	// than what we need will be built upon this object.
	const _initializeTallyAtRankNum = (rankNum, competingCandidates) => {
		// first adds property `rank_${rankNum}_tally` to _runoffTally.
		// allows it to be writable and enumerable, with value as empty object.
		Object.defineProperty(_runoffTally, `rank_${rankNum}_tally`, {
		  enumerable: true,
		  writable: true,
		  value: {} // empty object is initial value
		});

		// iterates through competingCandidates and builds an object whose key
		// is equal to the candidates name and whose value is initialized as 0.
		for (let candidate of competingCandidates) {
			// adds property [candidateName] to _runoffTally[`rank_${rankNum}_tally`]
			// allows it to be writable and enumerable, value as empty object.
			Object.defineProperty(_runoffTally[`rank_${rankNum}_tally`], candidate, {
			  enumerable: true,
			  writable: true,
			  value: 0 // initial value is 0
			});
		}			
	}

	// increments vote tally for a candidate argument
	const _addVoteToTallyAtRankNum = (candidateName, rankNum) => {
		// increments tally for candidate within `rank_${rankNum}_tally`
		_runoffTally[`rank_${rankNum}_tally`][candidateName]++;
	}

	// calculcates results (can call itself recursively to iterate through the ranks).
	// the idea is to check to see who has received the least number of first-place votes
	// and return that candidate as eliminated. If there is a tie for the least number of
	// votes among the runoff candidates, then this algorithm will proceed to check the second
	// place votes and tally from there -- continuing in this fashion until all there are no more
	// rankIndex's to check. If there is still a tie by the end, then the eliminated candidate will
	// be determined by a simple random selection.
	const _processRunoffCalculation = function (// default values
																							rankIndex = 0, // iterator
																							runoffCandidates = [..._candidates],
																							results = createRunoffResultsHelper(_candidates) ) {
																							// reults = {} ) {
		// _initializeTallyAtRankNum sets up _runoffTally at key [`rank_${rankNum}_tally`] as an object
		// whose keys are the candidates' names and whose values are initalized as 0.
		// (use '+1' b/c the rank number we're concerned about is 1 + the array index)
		_initializeTallyAtRankNum((rankIndex + 1), runoffCandidates);

		// iterates through _votes at vote[rankIndex] (in rankIndex=0, checks to see who has the least number of first-place votes)
		for (let vote of _votes) {
			// the candidated voted for at vote[rankIndex] exists among runoffCandidates
			if (runoffCandidates.includes(vote[rankIndex])) {
				// add their vote to the tally
				_addVoteToTallyAtRankNum(vote[rankIndex], rankIndex + 1);
			}
		}

		// finds runoffCandidates with least votes and those with most votes at
		// a given rank number among the runoffCandidates (both are arrays)
		// get candidatesWithLeastVotes by passing in _runoffTally at `rank_${rankIndex + 1}_tally`
		const candidatesWithLeastVotes = Tally.getLeastVotesCandidates(_runoffTally[`rank_${rankIndex + 1}_tally`]);
		// get candidatesWithMostVotes by passing in _runoffTally at `rank_${rankIndex + 1}_tally`
		const candidatesWithMostVotes = Tally.getMostVotesCandidates(_runoffTally[`rank_${rankIndex + 1}_tally`]);

		// isRunoffResolved instantiated as true if there is only one candidate
		// who has the least number of votes, or false if there is more than one.
		const isRunoffResolved = (candidatesWithLeastVotes.length == 1);

		// adds results of this rank's tally to results data
		results.addTallyDataAtRankNum({
			rank_num: rankIndex + 1,
			tally: _runoffTally[`rank_${rankIndex + 1}_tally`],
			is_resovled: isRunoffResolved,
			least_votes_candidates: candidatesWithLeastVotes,
			most_votes_candidates: candidatesWithMostVotes
		});

		// if there's only one element in candidatesWithLeastVotes, sets [0] as eliminated, returns.
		if (isRunoffResolved) {
			// adds eliminated candidate to results
			results.addEliminatedCandidate(candidatesWithLeastVotes[0]);
			console.log('runoff results', results.getData());
			return results.getData();
		}

		// if the function has reached this point, then there's
		// more than one candidate in the array. Proceed as follows:

		// if (rankIndex + 1 == _votes[0].length) (i.e. if there are no more ranks left to count)
		if (rankIndex + 1 == _votes[0].length) {

			// coin tosses beweent candidatesWithLeastVotes to see who is eliminated. returns results data.
			results.addEliminatedCandidate(
				candidatesWithLeastVotes[Math.floor(Math.random() * candidatesWithLeastVotes.length)]
			);
			console.log('runoff results', results.getData());
			return results.getData();
		}

		// if _processRunoffCalculation has reached this point, then proceed by calling itself recursively.
		console.log('runoff results', results.getData());
		// in recursive call make sure to pass on incremented rankIndex, candidatesWithLeastVotes and results
		return _processRunoffCalculation(++rankIndex, candidatesWithLeastVotes, results);

	}; // end of _processRunoffCalculation

	const runoffPrototype = {
		calculate() {
			return _processRunoffCalculation();
		}
	};

	return Object.create(runoffPrototype);
}

module.exports = createRunoff;


// runoff election data - intended structure:
/*
	{
	  runoff: {
			runoff_candidates: (array),
			eliminated: (string),
			rank_1_results: {
				tally: {
					choice1: X,
					choice2: X
				},
				is_resovled: (boolean),
				least_votes_candidates: (array),
				most_votes_candidates: (array)
			},
			rank_2_results: {
				tally: {
					choice1: X,
					choice2: X
				},
				is_resovled: (boolean),
				least_votes_candidates: (array),
				most_votes_candidates: (array)	
			}
    }
  }
*/



	// // creates object such that the keys are candidate names and their vales are set as 0.
	// // ex: {candidateOne: 0, candidateTwo: 0, ...etc}
	// const _runoffTally = _candidates.reduce((prev, currentCandidate) => {
	// 	return Object.assign({}, {currentCandidate: 0});
	// }, {}); // empty object is first value of reduce



	// // if there's no tally at this rank number, add it to _runoffTally
	// 	if (!_runoffTally[`rank_${rankNum}_tally`]) {
	// 		// adds property `rank_${rankNum}_tally` to _runoffTally.
	// 		// allows it to be writable and enumerable, value as empty object.
	// 		Object.defineProperty(_runoffTally, `rank_${rankNum}_tally`, {
	// 		  enumerable: true,
	// 		  writable: true,
	// 		  value: {} // empty object is initial value
	// 		});
	// 	}
	// 	// if the candidate doesn't exist at the given rank number in the tally
	// 	// if there's no tally at this rank number, add it to _runoffTally
	// 	if (!_runoffTally[`rank_${rankNum}_tally`][candidateName]) {
	// 		// adds property [candidateName] to _runoffTally[`rank_${rankNum}_tally`]
	// 		// allows it to be writable and enumerable, value as empty object.
	// 		Object.defineProperty(_runoffTally[`rank_${rankNum}_tally`], candidateName, {
	// 		  enumerable: true,
	// 		  writable: true,
	// 		  value: 0 // initial value is 0
	// 		});
	// 	}