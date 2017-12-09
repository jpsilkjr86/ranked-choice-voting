// imports election sampler
const createRankedChoiceElection = require('./election2.js');
// imports arrayShuffler function
const arrayShuffler = require('./array-shuffler.js');

// creates sample ranked choice election
const election = createRankedChoiceElection();

// sets the choices or candidates for the election
election.setChoices(['Pizza', 'Dumplings', 'Burgers', 'Tacos']);

// gets 10 sample votes to test ranked choice caclculation
for (let i = 0; i < 10; i++) {
	// adds a random arrangement of the elction choices to the votes
	election.addRankedVote(arrayShuffler(election.getChoices()));
}

console.log('\nelection.getChoices()', election.getChoices(), '\n');
console.log('\nelection.getVotes():\n', election.getVotes());
console.log('\nelection.calculateResult():\n', election.calculateResult());