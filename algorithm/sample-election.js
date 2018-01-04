// ***********************************************************
//  CAN ALSO RUN THIS FILE IN NODE: `node sample-election.js`
// ***********************************************************
// imports election sampler
const createRankedChoiceElection = require('./ranked-choice-election/election.js');
// imports arrayShuffler function
const arrayShuffler = require('./array-methods/array-shuffler.js');

function sampleElection () {

	// creates sample ranked choice election
	const election = createRankedChoiceElection();

	// sets the candidates or candidates for the election
	election.setCandidates(['Pizza', 'Dumplings', 'Burgers', 'Tacos', 'Kebab']);

	// gets 10 sample votes to test ranked choice caclculation
	for (let i = 0; i < 10; i++) {
		// adds a random arrangement of the elction candidates to the votes
		election.addRankedVote(arrayShuffler(election.getCandidates()));
	}

	const electionResults = election.getResults();

	console.log('\nelection.getCandidates()', election.getCandidates(), '\n');
	console.log('\nelection.getVotes():\n', election.getVotes());
	console.log('\nelectionResults:\n', electionResults);

	return electionResults;
}

module.exports = sampleElection;



// // testing immutability of setVotes (passed) and if it can overwrite (passed):
// const sampleVotes = [];
// for (let i = 0; i < 10; i++) {
// 	sampleVotes.push(arrayShuffler(election.getCandidates()));
// }

// election.setVotes(sampleVotes);
// console.log('sampleVotes', sampleVotes);

// sampleVotes[0][0] = 'KING KONG';
// console.log('sampleVotes changed:', sampleVotes);


// console.log('\nelection.getCandidates()', election.getCandidates(), '\n');
// console.log('\nelection.getVotes():\n', election.getVotes());



// // testing immutability of setCandidates (passed):

// const candidates = ['Pizza', 'Dumplings', 'Burgers', 'Tacos'];
// console.log('local candidates', candidates);
// election.setCandidates(candidates);
// console.log('\ncandidates set as:', election.getCandidates(), '\n');

// candidates[0] = 'King Kong';
// console.log('local candidates', candidates);
// console.log('\ncandidates set as:', election.getCandidates(), '\n');





// // for testing to see if mutating election data would mess with other data
// election.foo = 'bar';

// console.log('election', election);
// election.getCandidates();

// var test = createRankedChoiceElection();
// console.log('test', test);
// test.bazz = 'bizz';

// console.log('election', election);
// election.getCandidates();
// console.log('test', test);
// test.getCandidates();









// // for testing to see if original data can be mutated
// const candidates = election.getCandidates();
// const votes = election.getVotes();
// const tally = election.getCurrentTally();

// candidates[0] = 'asfaewfawefawefawfwf';
// votes[0][0] = 'aaaaaaaaaaaaaaaaaaaa';
// tally['Pizza'] = 17;
// console.log(candidates[0]);
// console.log(votes[0][0]);
// console.log(tally);


// console.log('\noriginal candidates after', election.getCandidates(), '\n');
// console.log('\nvotes after:\n', election.getVotes());
// console.log('\ntally after:\n', election.getCurrentTally());


// // for testing to see if creating a new election have any side effects (mutation etc)
// const election2 = createRankedChoiceElection('banana1', 'banana2', 'banana3', 'banana4');

// for (let i = 0; i < 10; i++) {
// 	election2.addRankedVote(arrayShuffler(election2.getCandidates()));
// }

// console.log('\noriginal candidates2', election2.getCandidates(), '\n');
// console.log('\nvotes2:\n', election2.getVotes());
// console.log('\ntally2:\n', election2.getCurrentTally());

// console.log('\noriginal candidates1 after', election.getCandidates(), '\n');
// console.log('\nvotes1 after:\n', election.getVotes());
// console.log('\ntally1 after:\n', election.getCurrentTally());