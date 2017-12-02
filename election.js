// createElection takes in choices as arguments and returns an object with methods
// whose state consists of private variables (achieved by creating a closure)
function createElection (...args) {
	// creates private array "choices" as new array equal to ...args
	const choices = [...args];
	// votes array initialized as an empty array
	const votes = [];

	// returns object with methods that have privileged access to "choices" array
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
		}
	}
}

module.exports = createElection;