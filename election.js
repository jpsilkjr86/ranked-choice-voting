
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

	// creates tally object
	function _createTally(candidates) {
		// first builds tally data:
		// .reduce here operates on the candidates array and returns an object whose
		// keys are set as each element of candidates and whose values are set as empty arrays,
		// which will hold each ranked vote that is counted toward each candidate.
		const tally = candidates.reduce((prev, currentCandidate) => {
			// reduce iterates over each element of candidates and builds an object that
			// consists of previous candidates (key-value pairs of {candidateName: []}) plus
			// {currentCandidate: []}.
			return Object.assign({}, prev, {[currentCandidate]: []}); // same as {...prev, ~~} ?
		}, {}); // initial value is empty object (so .reduce knows what to start building upon)

		// adds a non-enumerable method to tally called 'addVotes' (needs to be non-enumerable
		// so as to prevent it from showing up in a for-in loop).
		Object.defineProperty(tally, 'addVotes', {
		  enumerable: false,
		  value: function(votes) {
				// loops through votes array once
				for (let vote of votes) {
					// breaking condition for each vote
					let isTallied = false;
					// loops through ranked vote, breaks if it reaches the end of the
					// vote or if isTallied == true. this will ensure that votes are
					// only tallied for non-eliminated choices.
					for (let j = 0; j < vote.length && !isTallied; j++) {
						// if tally object has property "vote[j]"
						// (i.e. if the choice is still active in the election)
						if (this.hasOwnProperty(vote[j])) {
							// then push the ranked vote onto the property of tally object
							// that matches the choice at vote[j].
							this[vote[j]].push(vote)
							isTallied = true;
						}
					} // end of inner for loop
				} // end of for-of loop
			} // end of value
		});

		// returns object with tally properties and prototyped methods
		return tally;
	}

	function _generateInitialResultsData() {
		return {
			// copy of private _choices array
			choices: [..._choices],
			// two-level-deep copy of private _votes array
			submitted_ballots: _votes.map(vote => [...vote])
		};
	}

	// checks if any of the choices has a majority number of votes at current round tally
	function _winnerAtCurrentRound(tallyAtCurrentRound, numOfBallots) {
		// loops through tallyAtCurrentRound object (the choice key is a string of the choice.
		// its tally is the number of votes it has.)
		for (let choice in tallyAtCurrentRound) {
			// numOfVotes equals the number of vote elements pushed onto tallyAtCurrentRound[choice]
			const numOfVotes = tallyAtCurrentRound[choice].length;
			// if the number of the candidate's votes is over 50% of the total number of ballots cast
			if (( numOfVotes / numOfBallots) > .5) {
				// then return the choice as winner at current tally (object with choiceName: numOfVotes)
				return {[choice]: numOfVotes};
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
			// console.log('_findLowestScoreChoice\n', choice, tallyAtCurrentRound[choice]);
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
																			currentTally = _createTally(_choices),
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
			winner: _winnerAtCurrentRound(currentTally, resultsData.submitted_ballots.length),
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

		// if no winner, then calculate who was eliminated in that round.
		const eliminated =_findLowestScoreChoice(currentTally);
		console.log('eliminated', eliminated);
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

// // creates tally object
// 	function _createTally(candidates) {
// 		// first builds tally data:
// 		// .reduce here operates on the candidates array and returns an object whose
// 		// keys are set as each element of candidates and whose values are set as empty arrays,
// 		// which will hold each ranked vote that is counted toward each candidate.
// 		const tally = candidates.reduce((prev, currentCandidate) => {
// 			// reduce iterates over each element of candidates and builds an object that
// 			// consists of previous candidates (key-value pairs of {candidateName: []}) plus
// 			// {currentCandidate: []}.
// 			return Object.assign({}, prev, {[currentCandidate]: []}); // same as {...prev, ~~} ?
// 		}, {}); // initial value is empty object (so .reduce knows what to start building upon)

// 		// methods to be attached to tally object:
// 		const methods = {
// 			// for adding votes to tally
// 			addVotes(votes) {
// 				// loops through votes array once
// 				for (let vote of votes) {
// 					// breaking condition for each vote
// 					let isTallied = false;
// 					// loops through ranked vote, breaks if it reaches the end of the
// 					// vote or if isTallied == true. this will ensure that votes are
// 					// only tallied for non-eliminated choices.
// 					for (let j = 0; j < vote.length && !isTallied; j++) {
// 						// if tally object has property "vote[j]"
// 						// (i.e. if the choice is still active in the election)
// 						if (this.hasOwnProperty(vote[j])) {
// 							// then push the ranked vote onto the property of tally object
// 							// that matches the choice at vote[j].
// 							this[vote[j]].push(vote)
// 							isTallied = true;
// 						}
// 					} // end of inner for loop
// 				} // end of for-of loop
// 			} // end of addVotes()
// 		}; // end of methods

// 		// returns object with tally properties and prototyped methods
// 		return Object.assign(Object.create(methods), tally);
// 	}

// // creates tally object
// 	function _createTally(candidates) {
// 		// Tally that takes in args array and builds key-value
// 		// pairs such that the key is the arg[i] string and the value
// 		// is an empty array.
// 		function Tally (args) {
// 			args.forEach(arg => {
// 				this[arg] = [];
// 			});
// 		}

// 		// methods to be prototypally attached:

// 		// for adding votes to tally
// 		Tally.prototype.addVotes = function(votes) {
// 			// loops through votes array once
// 			for (let vote of votes) {
// 				// breaking condition for each vote
// 				let isTallied = false;
// 				// loops through ranked vote, breaks if it reaches the end of the
// 				// vote or if isTallied == true. this will ensure that votes are
// 				// only tallied for non-eliminated choices.
// 				for (let j = 0; j < vote.length && !isTallied; j++) {
// 					// if tally object has property "vote[j]"
// 					// (i.e. if the choice is still active in the election)
// 					if (this.hasOwnProperty(vote[j])) {
// 						// then push the ranked vote onto the property of tally object
// 						// that matches the choice at vote[j].
// 						this[vote[j]].push(vote)
// 						isTallied = true;
// 					}
// 				} // end of inner for loop
// 			} // end of for-of loop
// 		} // end of addVotes()


// 		const tally = new Tally(candidates);
// 		console.log('_createTally', tally);

// 		// returns object with tally properties and prototyped methods
// 		return tally;
// 	}



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