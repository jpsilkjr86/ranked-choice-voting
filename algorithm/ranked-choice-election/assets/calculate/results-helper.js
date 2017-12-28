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
	    DELETE: winner: (null or string),
	    ADD: absolute_majority_winner: (null or string), (OK)
	    ADD: most_votes_candidates: (array),
	    ADD: least_votes_candidates: (array),
	    CHANGE: eliminated: (array), (OK)
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
	    absolute_majority_winner: (null or string),
	    most_votes_candidates: (array),
	    least_votes_candidates: (array),
	    eliminated: (array),
	  },
	  round_3: {
	  	~~
	  },
	  ~~
	}
*/

// dependencies

const Tally = require('../tally.js');

function createResults (choices, votes) {
	
	// builts initial _resultsData object, private to this module (in closure)
	const _resultsData = {
		// copy of private choices array
		choices: [...choices],
		// two-level-deep copy of private votes array
		submitted_ballots: votes.map(vote => [...vote]),
		// number of votes cast
		num_of_votes_cast: votes.length
	};

	// simple tally data has just the candidates names and the number of votes they earned.
	// ex: {candidate1: 5, candidate2: 7...}
	const _calculateSimpleTally = tallyData => {
		const simpleData = {}
		// loops through tallyData object
		for (let candidate in tallyData) {
			// sets simpleData at key candidate equal to length of array of value at tallyData[candidate]
			simpleData[candidate] = tallyData[candidate].length;
		}
		return simpleData;
	}

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
			// creates a simple tally based on tally data (simple tally is an object
			// with just the candidates' names and the number of votes they earned)
			const simpleTally = _calculateSimpleTally(tally);
			// sets round-specific data (useful for election analytics and results verification)
			_resultsData[`round_${roundNum}`] = {
				// sets absolute_majority_winner (default is null)
				absolute_majority_winner: winner,
				// records deep copy of detailed tally
				detailed_tally: JSON.parse(JSON.stringify(tally)),
				// records simple tally data
				simple_tally: simpleTally,
				// sets eliminated (default null)
				eliminated: eliminated,
				// sets most_votes_candidates (array)
				most_votes_candidates: Tally.getMostVotesCandidates(tally),
				// sets least_votes_candidates (array)
				least_votes_candidates: Tally.getLeastVotesCandidates(tally)
			};
		},
		// adds election winner to private _resultsData
		addElectionWinner(winner) {
			// adds winner to private _resultsData object
			_resultsData.winner = winner;
		},
		// adds eliminated candidate to round data at a given roundNum
		addEliminatedToRoundData(eliminatedArg, roundNum) {
			// if eliminatedArg is an array, sets elim as an array copy.
			// otherwise elim is set as an array containing a single element eliminatedArg.
			let elim = Array.isArray(eliminatedArg) ? [...eliminatedArg] : [eliminatedArg];
			// sets eliminated value for round data
			_resultsData[`round_${roundNum}`]['eliminated'] = elim;
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


			// // temp variable
			// let eliminated;
			// // if eliminatedArg is an array
			// if (Array.isArray(eliminatedArg)) {
			// 	// if eliminatedArg has only one element, set eliminated equal to eliminatedArg[0].
			// 	// otherwise, set it equal to a copy of eliminatedArg 
			// 	eliminated = (eliminatedArg.length == 1 ? eliminatedArg[0] : [...eliminatedArg]);
			// }
			// // otherwise set eliminated equal to eliminatedArg
			// else {
			// 	eliminated = eliminatedArg;
			// }
			// // sets eliminated value for round data
			// _resultsData[`round_${roundNum}`]['eliminated'] = eliminated;