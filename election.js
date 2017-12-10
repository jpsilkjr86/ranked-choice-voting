
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

	function _getInitialTally() {
		return _choices.reduce((prev_choices, currentChoice) => {
			// reduce iterates over each value of _choices and builds an object that
			// consists of previous _choices (key-value pairs of {choice: 0}) plus
			// {currentChoice: 0}.
			return Object.assign({}, prev_choices, {[currentChoice]: []});
		}, {}); // initial value is empty object
	}

	// checks if any of the choices has a majority number of votes at current round tally
	function _winnerAtCurrentRound(tallyAtCurrentRound, numOfBallots) {
		// loops through tallyAtCurrentRound object (the choice key is a string of the choice.
		// its tally is the number of votes it has.)
		for (let choice in tallyAtCurrentRound) {
			// if the number of choice's votes is over 50% of the total number of numOfBallots
			if ((tallyAtCurrentRound[choice].length / numOfBallots) > .5) {
				// then return the choice as winner at current tally.
				return {[choice]: tallyAtCurrentRound[choice].length};
			}
		}
		// if the above loop doesn't return a winner, then return null.
		return null;
	}

	// returns lowest score candidate
	function _findLowestScoreChoice(tallyAtCurrentRound) {
		// set lowest as initially undefined
		let lowest;
		// loops through tally object
		for (let choice in tallyAtCurrentRound) {
			// if lowest is undefined, set equal to choice.
			if (!lowest) {
				lowest = choice;
			}
			// otherwise compare values
			else {
				// if the current choice has less votes than lowest,
				// then reset lowest to the current choice
				if (tallyAtCurrentRound[choice].length < tallyAtCurrentRound[lowest].length) {
					lowest = choice;
				}
			}
		}
		return lowest;
	}

	// main algorithm of ranked choice election (recursive)
	function _calculateElectionResults(	// default parameter values:
																			currentTally = _getInitialTally(),
																			votesToCount = _votes.map(vote => [...vote]),
																			roundNum = 1,
																			resultsData = {} ) {
		// ================== Tally Votes ==================

		// loops through votesToCount array once
		for (let vote of votesToCount) {
			// breaking condition for each vote
			let isTallied = false;
			// loops through vote, breaks if it reaches the end of the vote or if isTallied == true.
			// this will ensure that votes are only tallied for non-eliminated choices.
			for (let j = 0; j < vote.length && !isTallied; j++) {
				// if currentTally has property (vote[j])
				// (i.e. if the choice is still active in the election)
				if (currentTally.hasOwnProperty(vote[j])) {
					// then push the ranked vote onto the property of currentTally
					// that matches the choice at vote[j].
					currentTally[vote[j]].push(vote)
					isTallied = true;
				}
			}
		}
		// console.log('currentTally at round ' + roundNum + '\n', currentTally);
		// ============ Build resultsData Object ============

		// adds this initial data only if roundNum == 1
		if (roundNum == 1) {
			// sets resultsData.choices equal to copy of private _choices array
			resultsData.choices = [..._choices];
			// sets resultsData.submitted_ballots to two-level-deep copy of private _votes array
			resultsData.submitted_ballots = _votes.map(vote => [...vote]);
		}

		// sets round-specific data (useful for election analytics and results verification)
		resultsData[`round_${roundNum}`] = { 
			winner: _winnerAtCurrentRound(currentTally, resultsData.submitted_ballots.length),
			// needs deep copy
			tally: JSON.parse(JSON.stringify(currentTally)),
			eliminated: null
		};


		// ============= Determine Return Value =============
		// ============ (and whether to recurse) ============

		// if the round has a winner
		if (resultsData[`round_${roundNum}`].winner) {
			// set resultsData.winner equal to round winner
			resultsData.winner = resultsData[`round_${roundNum}`].winner;
			// return resultsData
			return resultsData;
		}

		// if no winner, then calculate who was eliminated in that round.
		const eliminated =_findLowestScoreChoice(currentTally);
		// extracts votesForEliminated from currentTally (2-level-deep copy)
		const votesForEliminated = currentTally[eliminated].map(vote => [...vote]);
		// deletes eliminated from currentTally
		delete currentTally[eliminated];
		// names a new pointer "stillActiveTally" to refer to currentTally
		// minus the eliminated candidate data.
		const stillActiveTally = currentTally;

		// add eliminated to resultsData object at the current round.
		resultsData[`round_${roundNum}`].eliminated = eliminated;
		// console.log('resultsData at end of round' + roundNum + '\n', resultsData);
		return _calculateElectionResults(stillActiveTally,
																			votesForEliminated,
																			++roundNum,
																			resultsData );

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
			// calls private function _initializeTally()
			_initializeTally();
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