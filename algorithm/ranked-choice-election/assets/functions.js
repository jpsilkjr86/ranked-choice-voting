
module.exports = {
	// retrieves array of candidates who have least number of votes
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
				// if the current candidate has fewer votes than lowest[0] (according to tallyData),
				// then empties lowest array and sets lowest[0] to the current candidate
				if (tallyData[candidate].length < tallyData[lowest[0]].length) {
					lowest = [];
					lowest.push(candidate);
				}
				// if the current candidate has the same number of votes as lowest[0],
				// then pushes current candidate onto the lowest array
				else if (tallyData[candidate].length == tallyData[lowest[0]].length) {
					lowest.push(candidate);
				}
				// if neither of the above two conditions are true, then just continues loop.
			}
		}
		return lowest;
	},

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
				// if the current candidate has fewer votes than most[0] (according to tallyData),
				// then empties most array and sets most[0] to the current candidate
				if (tallyData[candidate].length > tallyData[most[0]].length) {
					most = [];
					most.push(candidate);
				}
				// if the current candidate has the same number of votes as most[0],
				// then pushes current candidate onto the most array
				else if (tallyData[candidate].length == tallyData[most[0]].length) {
					most.push(candidate);
				}
				// if neither of the above two conditions are true, then just continues loop.
			}
		}
		return most;
	}
};