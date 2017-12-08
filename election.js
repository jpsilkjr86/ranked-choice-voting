
// createElection takes in choices as arguments and returns an object with methods
// whose state consists of private variables (achieved by creating a closure)
function createElection (...args) {

	// **************** PRIVATE VARIABLES IN CLOSURE ****************
	// creates private array "choices" as new array equal to ...args
	const choices = [...args];
	// votes array initialized as an empty array
	const votes = [];
	// tally is object with running total of votes for each candidate.
	// it is initialized as an object whose keys are candidate names and
	// whose values are their corresponding vote tally. Ex: {choice1: 0, choice2: 0}.
	const tally = choices.reduce((prevChoices, currentChoice) => {
		// reduce iterates over each value of choices and builds an object that
		// consists of previous choices (key-value pairs of {choice: 0}) plus
		// {currentChoice:0}.
		return Object.assign({}, prevChoices, {[currentChoice]: 0});
	}, {}); // initial value is empty object

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
} // end of createElection()

module.exports = createElection;

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














// // createElection takes in choices as arguments and returns an object with methods
// // whose state consists of private variables (achieved by creating a closure)
// function createElection (...args) {
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

// module.exports = createElection;