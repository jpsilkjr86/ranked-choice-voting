// creates tally object
function createTally(candidates, totalNumOfVotes) {

	// ********** Build Initial Structure of Object To Be Returned **********

	/* Intended strucutre: {
	
		candiatateOne: [~~],
		candiatateTwo: [~~],
		candiatateThree: [~~],
		candiatateFour: [~~]

	}   */

	// Solution: use .reduce to build an object by operating on candidates array

	// .reduce here operates on the candidates array and returns an object whose
	// keys are set as each element of candidates and whose values are set as empty arrays,
	// which will hold each ranked vote that is counted toward each candidate.
	const tally = candidates.reduce((prev, currentCandidate) => {
		// reduce iterates over each element of candidates and builds an object that
		// consists of previous candidates (key-value pairs of {candidateName: []}) plus
		// {currentCandidate: []}.
		return Object.assign({}, prev, {[currentCandidate]: []}); // same as {...prev, ~~} ?
	}, {}); // initial value is empty object (so .reduce knows what to start building upon)


	// ************************* Private Variables *************************

	// none yet

	// *********************** Non-enumerable Methods ************************
	// ***************** (need to be non-enumerable so as to *****************
	// *********** prevent them from showing up in a for-in loop). ***********

	// addVotes will sort the incoming votes by pushing them into each 
	// candidate's array within the tally object.
	Object.defineProperty(tally, 'addVotes', {
	  enumerable: false,
	  value: function(votes) {
			// loops through votes array once
			for (let vote of votes) {
				// breaking condition for each vote
				let isTallied = false;
				// loops through ranked vote, breaks if it reaches the end of the
				// vote or if isTallied == true. this will ensure that votes are
				// only tallied for non-eliminated choices.
				for (let j = 0; j < vote.length && !isTallied; j++) {
					// if tally object has property "vote[j]"
					// (i.e. if the choice is still active in the election)
					if (this.hasOwnProperty(vote[j])) {
						// then push the ranked vote onto the property of tally object
						// that matches the choice at vote[j].
						this[vote[j]].push(vote)
						isTallied = true;
					}
				} // end of inner for loop
			} // end of for-of loop
		} // end of value
	}); // end of addVotes definition

	// definition for non-enumerable method 'getMajorityVotesCandidate', which checks if any
	// of the candidates has a majority number of votes and, if so, returns the winner.
	Object.defineProperty(tally, 'getMajorityVotesCandidate', {
	  enumerable: false,
	  value: function () {
			// loops through tally object (the candidate key is a string of the candidate's name.
			// its tally is the number of votes it has.)
			for (let candidate in tally) {
				// numOfVotes equals the number of vote elements pushed onto tally[candidate]
				const numOfVotesForCandidate = tally[candidate].length;
				// if the number of the candidate's votes is over 50% of the total number of ballots cast
				if (( numOfVotesForCandidate / totalNumOfVotes) > .5) {
					// then return the candidate as winner at current tally (object with choiceName: numOfVotesForCandidate)
					return {[candidate]: numOfVotesForCandidate};
				}
			}
			// if the above loop doesn't return a winner, then return null.
			return null;
		} // end of value
	}); // end of getMajorityVotesCandidate definition

	// definition for non-enumerable method 'getLowestScoreCandidate', which returns
	// the name of the candidate who has received the least number of votes.
	Object.defineProperty(tally, 'getLowestScoreCandidate', {
	  enumerable: false,
	  value: function () {
			// set lowest as initially undefined
			let lowest;
			// loops through tally object
			for (let choice in tally) {
				// if lowest is undefined, set equal to choice.
				if (!lowest) {
					lowest = choice;
				}
				// otherwise compare values
				else {
					// if the current choice has less votes than lowest,
					// then reset lowest to the current choice
					if (tally[choice].length < tally[lowest].length) {
						lowest = choice;
					}
				}
			}
			return lowest;
		} // end of value
	}); // end of getLowestScoreCandidate definition

	Object.defineProperty(tally, 'eliminate', {
	  enumerable: false,
	  value: function (candidate) {
			// deletes eliminated candidate from tally
			delete tally[candidate];
		}
	}); // end of eliminate definition

	// returns object with tally properties and prototyped methods
	return tally;
}

module.exports = createTally;