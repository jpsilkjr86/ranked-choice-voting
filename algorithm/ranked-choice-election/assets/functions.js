
module.exports = {
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

	// checks if any of the candidates has a majority number of votes and, if so, returns the winner.
	getAbsoluteMajorityWinner(tallyData) {
		// gets the total number of votes by adding together the length of each array
		// of votes held by a candidate (accessed via Object.keys(tallyData)).
		const totalNumOfVotes = Object.keys(tallyData).reduce((sum, currentCandidate) => {
			return sum + tallyData[currentCandidate].length;
		}, 0);
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
	} // end of getAbsoluteMajorityWinner
};