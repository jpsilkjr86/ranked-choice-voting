
function createRunoff (candidatesArg, votesArg) {
	
	const _candidates = [...candidatesArg];

	const _votes = votesArg.map(vote => [...vote]);

	// calculcates results
	const _processRunoffCalculation = function (// default values
																							i = 0, // iterator
																							runoffCandidates = [..._candidates],
																							results = createResultsHelper(_candidates, _votes) ) {
		// iterates through _votes at vote[i] (in i=0, checks to see who has the most first-place votes)

			// increments vote totals for each runoff candidate

		// finds runoffCandidates with least votes

			// if there's only one element in candidatesWithLeastVotes, sets [0] as eliminated, returns.

			// if there's more than one candidate in the array

				// if runoffCandidates.length == candidatesWithLeastVotes.length (i.e. same number of members)

					// if (i + 1 == _candidates.length) (i.e. if there are no more iterations left)

						// coin tosses beweent candidatesWithLeastVotes to see who is eliminated. returns.
					
					// else calls _processRunoffCalculation recursively, incrementing i, passing on candidatesWithLeastVotes

	};

	const runoffPrototype = {
		calculate() {
			return _processResultsCalculation();
		}
	};

	return Object.create(runoffPrototype);
}

module.exports = createRunoff;