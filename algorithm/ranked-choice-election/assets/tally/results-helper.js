// The purpose of this results-helper module is to abstract the logic of building
// data that is structured like this:
/* {
	  choices: [1-d array],
	  submitted_ballots: [[2-d array]],
	  winner: (string),
	  round_1: {
	    tally: {
	      choice1: X,
	      choice2: X,
	      ~~
	    },
	    winner: (null or string),
	    eliminated: (null or string),
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
	  },
	  round_2: {
	    tally: {
	      choice1: Y,
	      choice2: Y,
	      ~~
	    },
	    winner: (null or string),
	    eliminated: (null or string)
	  },
	  round_3: {
	  	~~
	  },
	  ~~
	}
*/

function createResults (choices, votes) {
	
	// builts initial _resultsData object, private to this module (in closure)
	const _resultsData = {
		// copy of private choices array
		choices: [...choices],
		// two-level-deep copy of private votes array
		submitted_ballots: votes.map(vote => [...vote])
	};

	const resultsPrototype = {
		// getter for retrieving private _resultsData
		getData() {
			// returns deep copy of _resultsData
			return JSON.parse(JSON.stringify(_resultsData));
		},
		// adds round data to private _resultsData
		addRoundData(data) {
			// destructures roundNum, roundTally, winner, eliminated from data
			const { roundNum, tally, winner = null, eliminated = null } = data;
			// sets round-specific data (useful for election analytics and results verification)
			_resultsData[`round_${roundNum}`] = {
				// sets winner to null if null; otherwise makes shallow object copy
				winner: (winner == null ? null : Object.assign({}, winner)),
				// records deep copy
				tally: JSON.parse(JSON.stringify(tally)),

				eliminated: eliminated
			};
		},
		// adds election winner to private _resultsData
		addElectionWinner(winner) {
			// adds winner to private _resultsData object
			_resultsData.winner = Object.assign({}, winner);
		},
		// it's possible for a winner to initially be set as null but later reset to a different
		// value, such as if the last candidates are in a tie and there's a runoff to resolve
		// the tie. this method helps the user reset the round winner so that the results
		// data is all synced up without inconsistency.
		updateRoundWinner(roundNum, winner) {
			_resultsData[`round_${roundNum}`]['winner'] = Object.assign({}, winner);
		},
		// adds eliminated candidate to round data at a given roundNum
		addEliminatedToRoundData(eliminatedArg, roundNum) {
			// temp variable
			let eliminated;
			// if eliminatedArg is an array
			if (Array.isArray(eliminatedArg)) {
				// if eliminatedArg has only one element, set eliminated equal to eliminatedArg[0].
				// otherwise, set it equal to a copy of eliminatedArg 
				eliminated = (eliminatedArg.length == 1 ? eliminatedArg[0] : [...eliminatedArg]);
			}
			// otherwise set eliminated equal to eliminatedArg
			else {
				eliminated = eliminatedArg;
			}
			// sets eliminated value for round data
			_resultsData[`round_${roundNum}`]['eliminated'] = eliminated;
		},
		// adds runoff election results to round data
		addRunoffResultsToRound(data) {
			// destructures roundNum and runoff_results from data
			const { roundNum, runoffResults } = data;

			_resultsData[`round_${roundNum}`]['runoff'] = JSON.parse(JSON.stringify(runoffResults));
		}
	};

	return Object.create(resultsPrototype);
}

module.exports = createResults;