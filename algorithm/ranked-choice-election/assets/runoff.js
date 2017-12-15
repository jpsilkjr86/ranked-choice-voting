// dependencies
const createRunoffResultsHelper = require('./runoff/runoff-results-helper.js');

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

	// increments vote tally for a candidate argument
	const _addVoteToTallyAtRankNum = (candidateName, rankNum) => {
		// if there's no tally at this rank number, add it to _runoffTally
		if (!_runoffTally[`rank_${rankNum}_tally`]) {
			// adds property `rank_${rankNum}_tally` to _runoffTally.
			// allows it to be writable and enumerable, value as empty object.
			Object.defineProperty(_runoffTally, `rank_${rankNum}_tally`, {
			  enumerable: true,
			  writable: true,
			  value: {} // empty object is initial value
			});
		}
		// if the candidate doesn't exist at the given rank number in the tally
		// if there's no tally at this rank number, add it to _runoffTally
		if (!_runoffTally[`rank_${rankNum}_tally`][candidateName]) {
			// adds property [candidateName] to _runoffTally[`rank_${rankNum}_tally`]
			// allows it to be writable and enumerable, value as empty object.
			Object.defineProperty(_runoffTally[`rank_${rankNum}_tally`], candidateName, {
			  enumerable: true,
			  writable: true,
			  value: 0 // initial value is 0
			});
		}
		// increments tally for candidate within `rank_${rankNum}_tally`
		_runoffTally[`rank_${rankNum}_tally`][candidateName]++;
	}

	// checks which candidate in _runoffTally has the least number of votes
	// among candidates received as an argument. It is important to make the
	// competingCandidates an argument that can be passed in, since in theory
	// it is possible for three or more candidates to be competing in a runoff
	// election, and for there to be ties even within the runoff election.
	// this algorithm will resolve this by only passing in candidates who have
	// received the least number of votes as query parameters in the _runoffTally
	// object. in this way, candidates who have not received the least number of
	// votes will be removed from the competingCandidates naturally, but will not
	// be eliminated from the runoff election as a whole (remembering that the purpose
	// runoff election algorithm is to return the eliminated candidate, not a winner).
	const _getLeastVotesCandidatesAtRankNum = (competingCandidates, rankNum) => {
		// sets lowest as an initially empty array (use `let` so it can be reassigned later)
		let lowest = [];
		// saves tallyAtThisRank as _runoffTally[`rank_${rankNum}_tally`]
		const tallyAtThisRank = _runoffTally[`rank_${rankNum}_tally`];
		// loops through competingCandidates argument
		for (let candidate of competingCandidates) {
			// if there are no elements in lowest, push the candidate (first iteration)
			if (!lowest.length) {
				lowest.push(candidate);
			}
			// otherwise compare values
			else {
				// if the current candidate has fewer votes than lowest[0] (according to _runoffTally),
				// then empties lowest array and sets lowest[0] to the current candidate
				if (tallyAtThisRank[candidate] < tallyAtThisRank[lowest[0]]) {
					lowest = [];
					lowest.push(candidate);
				}
				// if the current candidate has the same number of votes as lowest[0],
				// then pushes current candidate onto the lowest array
				else if (tallyAtThisRank[candidate] == tallyAtThisRank[lowest[0]]) {
					lowest.push(candidate);
				}
				// if neither of the above two conditions are true, then just continues loop.
			}
		}
		return lowest;
	}

	// inverse of above function -- searches for candidate with most votes
	const _getMostVotesCandidatesAtRankNum = (competingCandidates, rankNum) => {
		// sets mostVotesCandidate as an initially empty array (use `let` so it can be reassigned later)
		let mostVotesCandidate = [];
		// saves tallyAtThisRank as _runoffTally[`rank_${rankNum}_tally`]
		const tallyAtThisRank = _runoffTally[`rank_${rankNum}_tally`];
		// loops through competingCandidates argument
		for (let candidate of competingCandidates) {
			// if there are no elements in mostVotesCandidate, push the candidate (first iteration)
			if (!mostVotesCandidate.length) {
				mostVotesCandidate.push(candidate);
			}
			// otherwise compare values
			else {
				// if the current candidate has fewer votes than mostVotesCandidate[0] (according to _runoffTally),
				// then empties mostVotesCandidate array and sets mostVotesCandidate[0] to the current candidate
				if (tallyAtThisRank[candidate] > tallyAtThisRank[mostVotesCandidate[0]]) {
					mostVotesCandidate = [];
					mostVotesCandidate.push(candidate);
				}
				// if the current candidate has the same number of votes as mostVotesCandidate[0],
				// then pushes current candidate onto the mostVotesCandidate array
				else if (tallyAtThisRank[candidate] == tallyAtThisRank[mostVotesCandidate[0]]) {
					mostVotesCandidate.push(candidate);
				}
				// if neither of the above two conditions are true, then just continues loop.
			}
		}
		return mostVotesCandidate;
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
		// iterates through _votes at vote[rankIndex] (in rankIndex=0, checks to see who has the least number of first-place votes)
		for (let vote of _votes) {
			// the candidated voted for at vote[rankIndex] exists among runoffCandidates
			if (runoffCandidates.includes(vote[rankIndex])) {
				// add their vote to the tally
				_addVoteToTallyAtRankNum(vote[rankIndex], rankIndex + 1);
			}
		}

		// finds runoffCandidates with least votes and those with most votes at
		// a given rank number among the runoffCandidates (both are arrays).
		const candidatesWithLeastVotes = _getLeastVotesCandidatesAtRankNum(runoffCandidates, rankIndex + 1);
		const candidatesWithMostVotes = _getMostVotesCandidatesAtRankNum(runoffCandidates, rankIndex + 1);

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

		// if runoffCandidates.length == candidatesWithLeastVotes.length (i.e. same number of members)
		// if (runoffCandidates.length == candidatesWithLeastVotes.length) {

			// if (rankIndex + 1 == _votes[0].length) (i.e. if there are no more ranks left to count)
			if (rankIndex + 1 == _votes[0].length) {

				// coin tosses beweent candidatesWithLeastVotes to see who is eliminated. returns results data.
				results.addEliminatedCandidate(
					candidatesWithLeastVotes[Math.floor(Math.random() * candidatesWithLeastVotes.length)]
				);
				console.log('runoff results', results.getData());
				return results.getData();
			}

			// else calls _processRunoffCalculation recursively
			else {
				console.log('runoff results', results.getData());
				// in recursive call make sure to pass on incremented rankIndex, candidatesWithLeastVotes and results
				return _processRunoffCalculation(++rankIndex, candidatesWithLeastVotes, results);
			}

		// }

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