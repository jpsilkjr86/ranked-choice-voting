// createElection takes in choices as arguments and returns an object with methods
// whose state consists of private variables (achieved by creating a closure)
function createElection (...args) {
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

	// returns object with methods that have privileged access to private data above
	return {
		// returns copy of array rather than ref. to it so it can't be mutated
		getChoices() {
			return [...choices];
		},
		addRankedVote(vote) {
			votes.push(vote);
		},
		getVotes() {
			// returns deep copy of votes array (array of arrays) to avoid mutation
			return JSON.parse(JSON.stringify(votes));
		},
		getTally() {
			// returns object copy of tally
			return Object.assign({}, tally);
		}
	}
}

module.exports = createElection;


















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