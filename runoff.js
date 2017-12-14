// runoff elections are for the purpose of resolving ties between candidates at any point
// in the ranked-choice-election process. it doesn't determine a winner; it determines who
// must be eliminated among the competing candidates -- i.e. whose votes must be redistributed
// among the remaining candidates in the ranked choice election.
function createRunoff (candidatesArg, votesArg) {
	// copies candidatesArg
	const _candidates = [...candidatesArg];
	// copies votesArg (two levels deep)
	const _votes = votesArg.map(vote => [...vote]);

	// creates object such that the keys are candidate names and their vales are set as 0.
	// ex: {candidateOne: 0, candidateTwo: 0, ...etc}
	const _runoffTally = _candidates.reduce((prev, currentCandidate) => {
		return Object.assign({}, {currentCandidate: 0});
	}, {}); // empty object is first value of reduce

	// increments vote tally for a candidate argument
	const _addVoteToCandidateTally = candidateName => {
		_runoffTally[candidateName]++;
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
	const _getCandidateWithLeastVotes = competingCandidates => {
		// sets lowest as an initially empty array
		let lowest = [];
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
				if (_runoffTally[candidate] < _runoffTally[lowest[0]]) {
					lowest = [];
					lowest.push(candidate);
				}
				// if the current candidate has the same number of votes as lowest[0],
				// then pushes current candidate onto the lowest array
				else if (_runoffTally[candidate] == _runoffTally[lowest[0]]) {
					lowest.push(candidate);
				}
				// if neither of the above two conditions are true, then just continues loop.
			}
		}
		return lowest;
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
																							// results = createResultsHelper(_candidates, _votes) ) {
																							reults = {} ) {
		// iterates through _votes at vote[rankIndex] (in rankIndex=0, checks to see who has the least number of first-place votes)
		for (let vote of _votes) {

			// increments vote totals for each runoff candidate
			_addVoteToCandidateTally(vote[rankIndex]);
		}

		// finds runoffCandidates with least votes among the runoffCandidates
		const candidatesWithLeastVotes = _getCandidateWithLeastVotes(runoffCandidates);

		// if there's only one element in candidatesWithLeastVotes, sets [0] as eliminated, returns.
		if (candidatesWithLeastVotes.length == 1) {
			return { eliminated: candidatesWithLeastVotes[0] }
		}

		// if the function has reached this point, then there's
		// more than one candidate in the array. Proceed as follows:

		// if runoffCandidates.length == candidatesWithLeastVotes.length (i.e. same number of members)
		if (runoffCandidates.length == candidatesWithLeastVotes.length) {

			// if (rankIndex + 1 == _candidates.length) (i.e. if there are no more iterations left)
			if (rankIndex + 1 == _candidates.length) {

				// coin tosses beweent candidatesWithLeastVotes to see who is eliminated. returns.
				return { eliminated: candidatesWithLeastVotes[Math.floor(Math.random() * candidatesWithLeastVotes.length)] };
			}

			// else calls _processRunoffCalculation recursively, incrementing rankIndex, passing on candidatesWithLeastVotes
			else {
				return _processRunoffCalculation(++rankIndex, candidatesWithLeastVotes);
			}

		}

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