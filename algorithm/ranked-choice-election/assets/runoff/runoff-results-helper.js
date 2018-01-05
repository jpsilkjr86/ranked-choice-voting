// The purpose of this results-helper module is to abstract the logic of building
// runoff results data, structured like this:
/* 
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
*/

function createRunoffResultsHelper (candidatesArg) {
	
	// builts initial _runoffResultsData object, private to this module (in closure)
	const _runoffResultsData = {
		// copy of candidatesArg array
		runoff_candidates: [...candidatesArg]
	};

	const runoffResultsPrototype = {
		// getter for retrieving private _runoffResultsData
		getData() {
			// returns deep copy of _runoffResultsData
			return JSON.parse(JSON.stringify(_runoffResultsData));
		},
		// adds rank tally data to private _runoffResultsData at rank_num argument
		addTallyDataAtRankNum(data) {
			// destructures these values from incoming data
			const { tally, is_resovled, least_votes_candidates, most_votes_candidates, rank_num } = data;
			// sets rank-specific data (useful for election analytics and results verification)
			_runoffResultsData[`rank_${rank_num}_results`] = {
				// deep copies tally
				tally: JSON.parse(JSON.stringify(tally)),
				// sets boolean as normal
				is_resovled: is_resovled,
				// copies array
				least_votes_candidates: [...least_votes_candidates],
				// most_votes_candidates might be an empty array or null. if so, set as null. otherwise, set as array copy.
				most_votes_candidates: !most_votes_candidates || most_votes_candidates.length == 0 ? (
																			null
																		) : (
																			[...most_votes_candidates]
																		)																		
			};
		},
		// adds eliminated to private _runoffResultsData
		addEliminatedCandidate(eliminated) {
			_runoffResultsData.eliminated = eliminated;
		},
		// eliminates random candidate and adds info to _runoffResultsData that says so
		eliminateRandomCandidate(data) {
			// destructures these values from incoming data
			const { competing_candidates, rank_num } = data;
			// randomly chooses an eliminated candidate from the competing_candidates array
			const randomly_eliminated = competing_candidates[Math.floor(Math.random() * competing_candidates.length)];
			// sets rank-specific data (useful for election analytics and results verification)
			_runoffResultsData[`rank_${rank_num}_results`][`random_resolution_of_tie_breaker`] = {
				competing_candidates,
				randomly_eliminated										
			};
			// adds to result data
			_runoffResultsData.eliminated = randomly_eliminated;
		}
	};

	return Object.create(runoffResultsPrototype);
}

module.exports = createRunoffResultsHelper;