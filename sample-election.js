// imports election sampler
const createElection = require('./election.js');
// imports arrayShuffler function
const arrayShuffler = require('./array-shuffler.js');

// creates sample ranked choice election
const election = createElection('Pizza', 'Dumplings', 'Burgers', 'Tacos');

// gets 10 sample votes to test ranked choice caclculation
for (let i = 0; i < 10; i++) {
	// adds a random arrangement of the elction choices to the votes
	election.addRankedVote(arrayShuffler(election.getChoices()));
}

console.log('\noriginal choices', election.getChoices(), '\n');
console.log('\nvotes:\n', election.getVotes());
console.log('\ntally:\n', election.getTally());




// // for testing to see if original data can be mutated (result: it can't)
// const choices = election.getChoices();
// const votes = election.getVotes();
// const tally = election.getTally();

// choices[0] = 'asfaewfawefawefawfwf';
// votes[0][0] = 'aaaaaaaaaaaaaaaaaaaa';
// tally['Pizza'] = 17;
// console.log(choices[0]);
// console.log(votes[0][0]);
// console.log(tally);


// console.log('\noriginal choices after', election.getChoices(), '\n');
// console.log('\nvotes after:\n', election.getVotes());
// console.log('\ntally after:\n', election.getTally());