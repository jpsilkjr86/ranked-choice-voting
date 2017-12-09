
// createRankedChoiceElection returns an object with methods that have privileged access
// to private variables (achieved by creating a closure)
function createRankedChoiceElection () {

	// **************** PRIVATE VARIABLES IN CLOSURE ****************
	// creates private array "_choices" (list of candidates)
	let _choices = [];

	// _votes array is an array of arrays (each member array represents ranked-choice vote)
	let _votes = [];

	// _tally is a private object that consists of key-value pairs such that each key
	// is a string that represents a choice or candidate, and each value is the an array
	// of votes that choice or candidate has earned. Ex: {choice1: [~~], choice2: [~~]}.
	let _tally = null;

	// ***************************************************************


	// ********************** PRIVATE FUNCTIONS **********************

	// _initializeTally takes the _choices array and converts it to an object where the
	// keys are set as each element of choice and their values are set as empty arrays.
	function _initializeTally () {
		_tally = _choices.reduce((prev_choices, currentChoice) => {
			// reduce iterates over each value of _choices and builds an object that
			// consists of previous _choices (key-value pairs of {choice: 0}) plus
			// {currentChoice: 0}.
			return Object.assign({}, prev_choices, {[currentChoice]: []});
		}, {}); // initial value is empty object
	}

	// checks if any of the _choices has a majority number of votes at current tally
	function _winnerAtCurrentRound() {
		// loops through _tally object (the choice key is a string of the choice.
		// its tally is the number of votes it has.)
		for (let choice in _tally) {
			// if the number of choice's votes is over 50% of the total number of _votes
			if ((_tally[choice].length / _votes.length) > .5) {
				// then return the choice as winner at current tally.
				return {[choice]: _tally[choice].length};
			}
		}
		// if the above loop doesn't return a winner, then return null.
		return null;
	}

	// function _calculateElectionResults() {
		
	// }
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
			// calls private function _initializeTally()
			_initializeTally();
		},
		setVotes(votesArg) {
			// sets votes equal to a two-level-deep copy of the votesArg array
			_votes = votesArg.map(vote => [...vote]);
		},
		addRankedVote(vote) {
			_votes.push(vote);
		}
	}; // end of electionPrototype

	// ***************************************************************

	// returns object prototypally inheriting electionPrototype methods that
	// have privileged access to private data above.
	return Object.assign({}, electionPrototype);

} // end of createRankedChoiceElection()

module.exports = createRankedChoiceElection;

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