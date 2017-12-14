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
	    eliminated: (null or string)
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
			_resultsData.winner = winner;
		}
	};

	return Object.create(resultsPrototype);
}

module.exports = createResults;