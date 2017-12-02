// imports arrayShuffler function
const arrayShuffler = require('./array-shuffler.js');

// function that creates closure with private array "choices"
function createSampleElection (...choices) {
	// choices is array that exists in closure
	console.log('choices in election-sampler', choices);

	// returns object with methods that have privileged access to "choices" array
	return {
		// returns copy of array so it can't be mutated
		getChoices() {
			return [...choices];
		},
		randomVote() {
			return arrayShuffler(choices);
		}
	}
}

module.exports = createSampleElection;