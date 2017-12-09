// imports election sampler
const createRankedChoiceElection = require('./election.js');
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
console.log('\nelection.getCurrentTally():\n', election.getCurrentTally());
console.log('\nelection.winnerAtCurrentTally():\n', election.winnerAtCurrentTally());

election.tallyFirstRound();

console.log('\nwinnerAtCurrentTally1:\n', election.winnerAtCurrentTally());
console.log('\nelection.getCurrentTally():\n', election.getCurrentTally());




// // testing immutability of setVotes (passed) and if it can overwrite (passed):
// const sampleVotes = [];
// for (let i = 0; i < 10; i++) {
// 	sampleVotes.push(arrayShuffler(election.getChoices()));
// }

// election.setVotes(sampleVotes);
// console.log('sampleVotes', sampleVotes);

// sampleVotes[0][0] = 'KING KONG';
// console.log('sampleVotes changed:', sampleVotes);


// console.log('\nelection.getChoices()', election.getChoices(), '\n');
// console.log('\nelection.getVotes():\n', election.getVotes());



// // testing immutability of setChoices (passed):

// const choices = ['Pizza', 'Dumplings', 'Burgers', 'Tacos'];
// console.log('local choices', choices);
// election.setChoices(choices);
// console.log('\nchoices set as:', election.getChoices(), '\n');

// choices[0] = 'King Kong';
// console.log('local choices', choices);
// console.log('\nchoices set as:', election.getChoices(), '\n');





// // for testing to see if mutating election data would mess with other data
// election.foo = 'bar';

// console.log('election', election);
// election.getChoices();

// var test = createRankedChoiceElection();
// console.log('test', test);
// test.bazz = 'bizz';

// console.log('election', election);
// election.getChoices();
// console.log('test', test);
// test.getChoices();









// // for testing to see if original data can be mutated
// const choices = election.getChoices();
// const votes = election.getVotes();
// const tally = election.getCurrentTally();

// choices[0] = 'asfaewfawefawefawfwf';
// votes[0][0] = 'aaaaaaaaaaaaaaaaaaaa';
// tally['Pizza'] = 17;
// console.log(choices[0]);
// console.log(votes[0][0]);
// console.log(tally);


// console.log('\noriginal choices after', election.getChoices(), '\n');
// console.log('\nvotes after:\n', election.getVotes());
// console.log('\ntally after:\n', election.getCurrentTally());


// // for testing to see if creating a new election have any side effects (mutation etc)
// const election2 = createRankedChoiceElection('banana1', 'banana2', 'banana3', 'banana4');

// for (let i = 0; i < 10; i++) {
// 	election2.addRankedVote(arrayShuffler(election2.getChoices()));
// }

// console.log('\noriginal choices2', election2.getChoices(), '\n');
// console.log('\nvotes2:\n', election2.getVotes());
// console.log('\ntally2:\n', election2.getCurrentTally());

// console.log('\noriginal choices1 after', election.getChoices(), '\n');
// console.log('\nvotes1 after:\n', election.getVotes());
// console.log('\ntally1 after:\n', election.getCurrentTally());