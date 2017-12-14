
function createRunoff (candidatesArg, votesArg) {
	
	const _candidates = [...candidatesArg];

	const _votes = votesArg.map(vote => [...vote]);

	// creates object such that the keys are candidate names and their vales are set as 0.
	// ex: {candidateOne: 0, candidateTwo: 0, ...etc}
	const _runoffTally = _candidates.reduce((prev, currentCandidate) => {
		return Object.assign({}, {currentCandidate: 0});
	}, {}); // empty object is first value of reduce

	const _addVoteToCandidateTally = candidateName => {
		_runoffTally[candidateName]++;
	}

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

	// calculcates results
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