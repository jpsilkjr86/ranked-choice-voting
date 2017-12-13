// dependencies
const createTally = require('./tally.js');

// createRankedChoiceElection returns an object with methods that have privileged access
// to private variables (achieved by creating a closure)
function createRankedChoiceElection () {

	// **************** PRIVATE VARIABLES IN CLOSURE ****************

	// creates private array "_choices" (list of candidates)
	let _choices = [];

	// _votes array is an array of arrays (each member array represents ranked-choice vote)
	let _votes = [];

	// ***************************************************************


	// ********************** PRIVATE FUNCTIONS **********************

	// main algorithm of ranked choice election (recursive)
	function _calculateElectionResults() {

		const rankedChoiceTally = createTally(_choices, _votes);

		const electionResults = rankedChoiceTally.calculate();

		return electionResults;

	} // end of _calculateElectionResults()

	// ***************************************************************


	// **************** PROTOTYPE OF OBJECT TO RETURN ****************
	const electionPrototype = {
		// returns copy of choices array rather than ref to it so it can't be mutated
		getChoices() {
			return [..._choices];
		},
		getVotes() {
			// returns deep copy of _votes array (array of arrays) to avoid mutation
			return JSON.parse(JSON.stringify(_votes));
		},
		setChoices(choicesArg) {
			// sets _choices equal to a copy of the array argument
			_choices = [...choicesArg];
		},
		setVotes(votesArg) {
			// sets votes equal to a two-level-deep copy of the votesArg array
			_votes = votesArg.map(vote => [...vote]);
		},
		addRankedVote(vote) {
			_votes.push(vote);
		},
		calculateResult() {
			return _calculateElectionResults();
		}
	}; // end of electionPrototype

	// ***************************************************************

	// returns object prototypally inheriting electionPrototype methods that
	// have privileged access to private data above.
	return Object.assign({}, electionPrototype);

} // end of createRankedChoiceElection()

module.exports = createRankedChoiceElection;

/*
// main algorithm of ranked choice election (recursive)
	function _calculateElectionResults(	// default parameter values:
																			currentTally = createTally(_choices, _votes.length),
																			votesToCount = _votes.map(vote => [...vote]),
																			roundNum = 1,
																			resultsData = _generateInitialResultsData() ) {
		// ================== Tally Votes ==================

		currentTally.addVotes(votesToCount);
		
		console.log('currentTally at round ' + roundNum + '\n', currentTally);

		// ============ Build resultsData Object ============

		// sets round-specific data (useful for election analytics and results verification)
		resultsData[`round_${roundNum}`] = {
			// winner might be returned as null or not null depending on tally
			winner: currentTally.getMajorityVotesCandidate(),
			// needs deep copy
			tally: JSON.parse(JSON.stringify(currentTally)),
			// eliminated set initially to null (may change below)
			eliminated: null
		};


		// ============= Determine Return Value =============
		// ============ (and whether to recurse) ============

		// if the round has a winner
		if (resultsData[`round_${roundNum}`].winner) {
			// set overall winner equal to round winner
			resultsData.winner = resultsData[`round_${roundNum}`].winner;
			// return resultsData
			return resultsData;
		}

		// if no winner, then find who had received the least number of votes in the round.
		const eliminated = currentTally.getLowestScoreCandidate();
		console.log('eliminated', eliminated);

		// extracts votesForEliminated from currentTally at eliminated key (2-level-deep copy)
		const votesForEliminated = currentTally[eliminated].map(vote => [...vote]);
		
		// eliminates candidate with least number of votes from tally (deletes property)
		currentTally.eliminate(eliminated);

		// adds eliminated to resultsData object at the current round.
		resultsData[`round_${roundNum}`].eliminated = eliminated;

		// console.log('resultsData at end of round' + roundNum + '\n', resultsData);

		// if it's reached this point, then it means a winner has yet to be determined.
		// then the function should call itself recursively, making sure to pass on
		// currentTally and resultsData so as to continue using them in the next rounds.
		return _calculateElectionResults(currentTally,
																			votesForEliminated,
																			++roundNum,
																			resultsData );

	} // end of _calculateElectionResults()

*/


/*
[ [ 'Tacos', 'Burgers', 'Dumplings', 'Pizza' ],
  [ 'Tacos', 'Pizza', 'Burgers', 'Dumplings' ],
  [ 'Burgers', 'Dumplings', 'Tacos', 'Pizza' ],
  [ 'Burgers', 'Tacos', 'Pizza', 'Dumplings' ],
  [ 'Tacos', 'Burgers', 'Dumplings', 'Pizza' ],
  [ 'Tacos', 'Pizza', 'Dumplings', 'Burgers' ],
  [ 'Burgers', 'Dumplings', 'Tacos', 'Pizza' ],
  [ 'Dumplings', 'Tacos', 'Burgers', 'Pizza' ],
  [ 'Burgers', 'Pizza', 'Tacos', 'Dumplings' ],
  [ 'Tacos', 'Burgers', 'Pizza', 'Dumplings' ] ]
  */

  /*
  preferred result object:
  {
	  choices: [],
	  submitted_ballots: [],
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
	      ~~
	    },
	    ~~
	  },
	  ~~
	}

	*/