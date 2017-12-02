// imports election sampler
const ElectionSampler = require('./election-sampler.js');

// creates sample ranked choice election
const election = ElectionSampler('Pizza', 'Dumplings', 'Burgers', 'Tacos');

// creates array of sample votes, initially empty
const randomSampleOfVotes = [];

// gets 10 example votes for ranked choice caclculation
for (let i = 0; i < 10; i++) {
	randomSampleOfVotes.push(election.randomVote());
}

console.log('original choices', election.getChoices(), '\n');
console.log('randomSampleOfVotes\n', randomSampleOfVotes);