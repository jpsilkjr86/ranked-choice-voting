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










// // for testing to see if mutating election data would mess with other data
// election.foo = 'bar';

// console.log('election', election);
// election.getChoices();

// var test = createElection();
// console.log('test', test);
// test.bazz = 'bizz';

// console.log('election', election);
// election.getChoices();
// console.log('test', test);
// test.getChoices();









// // for testing to see if original data can be mutated
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


// // for testing to see if creating a new election have any side effects (mutation etc)
// const election2 = createElection('banana1', 'banana2', 'banana3', 'banana4');

// for (let i = 0; i < 10; i++) {
// 	election2.addRankedVote(arrayShuffler(election2.getChoices()));
// }

// console.log('\noriginal choices2', election2.getChoices(), '\n');
// console.log('\nvotes2:\n', election2.getVotes());
// console.log('\ntally2:\n', election2.getTally());

// console.log('\noriginal choices1 after', election.getChoices(), '\n');
// console.log('\nvotes1 after:\n', election.getVotes());
// console.log('\ntally1 after:\n', election.getTally());