// Tally is an object with pure functions as methods that are single purpose,
// return a single value, and have no shared state or side effects. These methods
// perform basic calculations related to tallyData arguments.
const Tally = {
	// retrieves array of candidates who have least number of votes.
	// this function can handle tallyData where the values of each candidate key are arrays,
	// as well as tallyData where the values of each candidate key are numbers.
	getLeastVotesCandidates(tallyData) {
		// sets lowest as an initially empty array (use `let` so it can be reassigned later)
		let lowest = [];
		// loops through candidates (the keys of tallyData)
		for (let candidate of Object.keys(tallyData)) {
			// if there are no elements in lowest, push the candidate (first iteration)
			if (!lowest.length) {
				lowest.push(candidate);
			}
			// otherwise compare values
			else {
				// temp variables
				let numOfVotesForCurrentCandidate,
					numOfVotesInLowest;
				// ***** IF tallyData[candidate] IS AN ARRAY *****
				if (Array.isArray(tallyData[candidate])) {
					// sets numOfVotes as length of array at tallyData key [candidate]
					numOfVotesForCurrentCandidate = tallyData[candidate].length;
					numOfVotesInLowest = tallyData[lowest[0]].length;
				}
				// ***** IF tallyData[candidate] IS A NUMBER *****
				else {
					// sets numOfVotes as the value of tallyData at key [candidate]
					numOfVotesForCurrentCandidate = tallyData[candidate];
					numOfVotesInLowest = tallyData[lowest[0]];
				}
				// ***** MAIN LOGIC *****
				// if the current candidate has fewer votes than those in lowest array (according to tallyData),
				// then empties lowest array and sets lowest[0] to the current candidate
				if (numOfVotesForCurrentCandidate < numOfVotesInLowest) {
					lowest = [];
					lowest.push(candidate);
				}
				// if the current candidate has the same number of votes as lowest[0],
				// then pushes current candidate onto the lowest array
				else if (numOfVotesForCurrentCandidate == numOfVotesInLowest) {
					lowest.push(candidate);
				}

				// if neither of the above two conditions are true, then just continues loop.
			}
		}
		return lowest;
	}, // end of getLeastVotesCandidates

	// retrieves array of candidates who have most number of votes
	getMostVotesCandidates(tallyData) {
		// sets most as an initially empty array (use `let` so it can be reassigned later)
		let most = [];
		// loops through candidates (the keys of tallyData)
		for (let candidate of Object.keys(tallyData)) {
			// if there are no elements in most, push the candidate (first iteration)
			if (!most.length) {
				most.push(candidate);
			}
			// otherwise compare values
			else {
				// temp variables
				let numOfVotesForCurrentCandidate,
					numOfVotesInMost;
				// ***** IF tallyData[candidate] IS AN ARRAY *****
				if (Array.isArray(tallyData[candidate])) {
					// sets numOfVotes as length of array at tallyData key [candidate]
					numOfVotesForCurrentCandidate = tallyData[candidate].length;
					numOfVotesInMost = tallyData[most[0]].length;
				}
				// ***** IF tallyData[candidate] IS A NUMBER *****
				else {
					// sets numOfVotes as the value of tallyData at key [candidate]
					numOfVotesForCurrentCandidate = tallyData[candidate];
					numOfVotesInMost = tallyData[most[0]];
				}
				// ***** MAIN LOGIC *****
				// if the current candidate has fewer votes than those in 'most' array (according to tallyData),
				// then empties most array and sets most[0] to the current candidate
				if (numOfVotesForCurrentCandidate > numOfVotesInMost) {
					most = [];
					most.push(candidate);
				}
				// if the current candidate has the same number of votes as most[0],
				// then pushes current candidate onto the most array
				else if (numOfVotesForCurrentCandidate == numOfVotesInMost) {
					most.push(candidate);
				}
				// if neither of the above two conditions are true, then just continues loop.
			}
		}
		return most;
	}, // end of getMostVotesCandidates

	// returns an array of all the candidates
	getCandidates(tallyData) {
		return Object.keys(tallyData);
	},

	// calculates and returns number of votes
	getTotalNumOfVotes(tallyData) {
		// gets the total number of votes by adding together the length of each array
		// of votes held by a candidate (accessed via Object.keys(tallyData)).
		return Tally.getCandidates(tallyData).reduce((sum, currentCandidate) => {
			return sum + tallyData[currentCandidate].length;
		}, 0);
	},

	// checks if any of the candidates has a majority number of votes and, if so, returns the winner.
	getAbsoluteMajorityWinner(tallyData) {
		// saves totalNumOfVotes for descriptiveness
		const totalNumOfVotes = Tally.getTotalNumOfVotes(tallyData);
		// loops through tallyData object (the candidate key is a string of the candidate's name.
		// the value at the key is an array of the votes they have.)
		for (let candidate in tallyData) {
			// numOfVotes equals the number of vote elements pushed onto tallyData[candidate]
			const numOfVotesForCandidate = tallyData[candidate].length;
			// if the number of the candidate's votes is over 50% of the total number of ballots cast
			if (( numOfVotesForCandidate / totalNumOfVotes) > .5) {
				// then return the candidate as winner at current tallyData
				return candidate;
			}
		}
		// if the above loop doesn't return a winner, then return null.
		return null;
	}, // end of getAbsoluteMajorityWinner

	extractEliminatedCandidate(tallyData, candidate) {
		const copy = JSON.parse(JSON.stringify(tallyData));

		delete copy[candidate];

		return copy;
	},

	// distributes the incoming votesToDistribute by pushing them into each 
	// candidate's array within the tallyData object.
	distributeVotes(tallyData, votesToDistribute) {
		// always copies tallyData to maintain function purity
		const copy = JSON.parse(JSON.stringify(tallyData));
		// loops through votesToDistribute array once
		for (let vote of votesToDistribute) {
			// breaking condition for each vote
			let isTallied = false;
			// loops through ranked vote, breaks if it reaches the end of the
			// vote or if isTallied == true. this will ensure that votes are
			// only tallied for non-eliminated choices.
			for (let j = 0; j < vote.length && !isTallied; j++) {
				// if copy object has property "vote[j]"
				// (i.e. if the choice is still active in the election)
				if (copy.hasOwnProperty(vote[j])) {
					// then pushes a copy of the ranked vote onto the property of the tally copy object
					// that matches the choice at vote[j].
					copy[vote[j]].push([...vote])
					isTallied = true;
				}
			} // end of inner for loop
		} // end of for-of loop
		// returns new tally object with votes all distributed
		return copy;
	}, // end of distributeVotes


	// initializeDetailedTally builds structure and initial values of detailed tally object.

	// intended structure: {
		
	// 	candiatateOne: [~~], // (array holds the ballots counted toward that candidate)
	// 	candiatateTwo: [~~],
	// 	candiatateThree: [~~],
	// 	candiatateFour: [~~]

	// } 
	initializeDetailedTally(candidates) {
		// .reduce here operates on the candidates array and returns an object whose
		// keys are set as each element of candidates and whose values are set as empty arrays,
		// which will hold each ranked vote that is counted toward each candidate.
		return candidates.reduce((prev, currentCandidate) => {
			// at each iteration, returns a new object that is combined with the previous iteration's object.
			return Object.assign({}, prev, {[currentCandidate]: []}); // same as ES6+: {...prev, ~~} ?
		}, {}); // initial value is empty object (so .reduce knows what to start building upon)
	}, // end of initializeDetailedTally

	// function for retrieving all ballots by iterating through a tally object
	getAllBallots(tallyData) {
		// return value
		const ballots = [];	
		// for each candidate key in tallyData
		for (let candidate in tallyData) {
			// for each vote in tha candidate's tally
			for (let vote of tallyData[candidate]) {
				// pushes a copy of the vote array onto ballots
				ballots.push([...vote]);
			}
		}
		// returns ballots at the end
		return ballots;
	} // end of getAllBallots

}; // end of Tally

module.exports = Tally;