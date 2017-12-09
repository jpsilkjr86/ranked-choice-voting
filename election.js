// createRankedChoiceElection returns an object with methods that have privileged access
// to private variables (achieved by creating a closure)
function createRankedChoiceElection () {
	// **************** PRIVATE VARIABLES IN CLOSURE ****************
	// creates private array "choices" (list of candidates)
	let choices = [];
	// votes array is an array of arrays (each member array represents ranked-choice vote)
	let votes = [];
	// tally is a private object that consists of key-value pairs such that each key
	// is a string that represents a choice or candidate, and each value is the number
	// of votes that choice or candidate has earned. Ex: {choice1: 0, choice2: 0}.
	let tally = null;

	let tallyWithBallots = null;

	// ***************************************************************

	// ********************** PRIVATE FUNCTIONS **********************
	// initializeTally takes the choices array and converts it to an object where the
	// keys are set as each choice (candidate) and their values are set as 0, respresenting
	// their initial vote tallies. 
	function initializeTally () {
		tally = choices.reduce((prevChoices, currentChoice) => {
			// reduce iterates over each value of choices and builds an object that
			// consists of previous choices (key-value pairs of {choice: 0}) plus
			// {currentChoice: 0}.
			return Object.assign({}, prevChoices, {[currentChoice]: 0});
		}, {}); // initial value is empty object
	}
	// ***************************************************************

	// *********************** OBJECT TO RETURN ***********************
	const election = {
		// returns copy of array rather than ref. to it so it can't be mutated
		getChoices() {
			return [...choices];
		},
		getVotes() {
			// returns deep copy of votes array (array of arrays) to avoid mutation
			return JSON.parse(JSON.stringify(votes));
		},
		setChoices(choicesArg) {
			// sets choices equal to a copy of the array argument
			choices = [...choicesArg];
			// calls private function initializeTally()
			initializeTally();
		},
		setVotes(votesArg) {
			// sets votes equal to a two-level-deep copy of the votesArg array
			votes = votesArg.map(vote => [...vote]);
		},
		getCurrentTally() {
			// returns object copy of tally
			return Object.assign({}, tally);
		},
		addRankedVote(vote) {
			votes.push(vote);
		},
		// checks if any of the choices has a majority number of votes at current tally
		winnerAtCurrentTally() {
			// loops through tally object (the choice key is a string of the choice.
			// its tally is the number of votes it has.)
			for (let choice in tally) {
				// if the number of choice's votes is over 50% of the total number of votes
				if ((tally[choice] / votes.length) > .5) {
					// then return the choice as winner at current tally.
					return {[choice]: tally[choice]};
				}
			}
			// if the above loop doesn't return a winner, then return null.
			return null;
		},
		tallyFirstRound() {
			// loop through votes array
			for (let vote of votes) {
				tally[vote[0]]++;
			}
		}
	}; // end of election object
	// ***************************************************************

	// returns object prototypally inheriting election methods that
	// have privileged access to private data above.
	return Object.assign({}, election);
} // end of createRankedChoiceElection()

module.exports = createRankedChoiceElection;

			// // loops through tally object
			// for (let choiceTally of tally) {
			// 	// if the choice has over 50% of the total number of votes
			// 	if ((choiceTally / votes.length) > .5)
			// 		// then return the winner at currentTally (copy)
			// 		return Object.assign({}, choiceTally);
			// }
			// // if the above loop doesn't return true then return false by default
			// return null;

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


// PSEUDOCODE FOR GETTING RESULT OF RANKED CHOICE ELECTION

// iterate through votes array, starting at index 0

	// 











// // createRankedChoiceElection takes in choices as arguments and returns an object with methods
// // whose state consists of private variables (achieved by creating a closure)
// function createRankedChoiceElection (...args) {
// 	// creates private array "choices" as new array equal to ...args
// 	const choices = [...args];
// 	// votes array initialized as an empty array
// 	const votes = [];

// 	// returns object with methods that have privileged access to "choices" array
// 	return {
// 		// returns copy of array rather than ref. to it so it can't be mutated
// 		getChoices() {
// 			return [...choices];
// 		},
// 		addRankedVote(vote) {
// 			votes.push(vote);
// 		},
// 		getVotes() {
// 			// returns deep copy of votes array (array of arrays) to avoid mutation
// 			return JSON.parse(JSON.stringify(votes));
// 		}
// 	}
// }

// module.exports = createRankedChoiceElection;