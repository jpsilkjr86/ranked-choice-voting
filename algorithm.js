
// sample choices for ranked choice voting
const choices = ['Pizza', 'Dumplings', 'Burgers', 'Tacos'];

// function that takes an array argument and returns a new
// array with same elements but in shuffled order
function shuffleOrder(array) {
	// create copy of the array
	const copy = [...array];
	// instantiate shuffled (return value) as empty array
	const shuffled = [];

	// grabs random index of array based on its length
	function randIndex(a) {
		return Math.floor(Math.random() * a.length);
	}

	// while copy array still has length
	while (copy.length > 0) {
		// if there's more than one element in copy, set i equal random index of copy.
		// if there's only one element left, set i equal to 0.
		let i = (copy.length > 1 ? randIndex(copy) : 0);
		// pushes element at random index i onto shuffled array
		shuffled.push(copy[i]);
		// splices out element at index i in copy
		copy.splice(i, 1);
	}

	return shuffled;
}

const randomSampleOfVotes = [];

// gets 10 example votes for ranked choice caclculation
for (let i = 0; i < 10; i++) {
	randomSampleOfVotes.push(shuffleOrder(choices));
}

// const shuffledArray = shuffleOrder(choices);

console.log('choices', choices);
console.log('randomSampleOfVotes\n', randomSampleOfVotes);
