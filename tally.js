// createTally returns an object with methods that have privileged access
// to private variables (achieved by creating a closure)
function createTally(candidatesArg, votesArg) {

	// *************** Private Variables (stored in closure) ***************

	// copies arguments and saves as private variables

	// shallow copy of one-dimensional array
	const _candidates = [...candidatesArg];
	// two-level deep copy of two-dimensional array
	const _votes = votesArg.map(vote => [...vote]);

	// Builds Initial Structure of Object To Be Returned:

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
	const _tally = _candidates.reduce((prev, currentCandidate) => {
		// reduce iterates over each element of candidates and builds an object that
		// consists of previous candidates (key-value pairs of {candidateName: []}) plus
		// {currentCandidate: []}.
		return Object.assign({}, prev, {[currentCandidate]: []}); // same as ES6+: {...prev, ~~} ?
	}, {}); // initial value is empty object (so .reduce knows what to start building upon)

	// ******************************************************************


	// *********************** Private Functions ************************

	// _sortVotes will sort the incoming votes by pushing them into each 
	// candidate's array within the _tally object.
	function _sortVotes(votes) {
		// loops through votes array once
		for (let vote of votes) {
			// breaking condition for each vote
			let isTallied = false;
			// loops through ranked vote, breaks if it reaches the end of the
			// vote or if isTallied == true. this will ensure that votes are
			// only tallied for non-eliminated choices.
			for (let j = 0; j < vote.length && !isTallied; j++) {
				// if _tally object has property "vote[j]"
				// (i.e. if the choice is still active in the election)
				if (_tally.hasOwnProperty(vote[j])) {
					// then push the ranked vote onto the property of _tally object
					// that matches the choice at vote[j].
					_tally[vote[j]].push(vote)
					isTallied = true;
				}
			} // end of inner for loop
		} // end of for-of loop
	} // end of _sortVotes definition

	// checks if any of the candidates has a majority number of votes and, if so, returns the winner.
	function _getMajorityVotesCandidate () {
		// loops through _tally object (the candidate key is a string of the candidate's name.
		// its tally is the number of votes it has.)
		for (let candidate in _tally) {
			// numOfVotes equals the number of vote elements pushed onto _tally[candidate]
			const numOfVotesForCandidate = _tally[candidate].length;
			// if the number of the candidate's votes is over 50% of the total number of ballots cast
			if (( numOfVotesForCandidate / _votes.length) > .5) {
				// then return the candidate as winner at current _tally (object with choiceName: numOfVotesForCandidate)
				return {[candidate]: numOfVotesForCandidate};
			}
		}
		// if the above loop doesn't return a winner, then return null.
		return null;
	} // end of _getMajorityVotesCandidate definition

	// returns the name of the candidate who has received the least number of votes.
	function _getLowestScoreCandidate () {
		// set lowest as initially undefined
		let lowest;
		// loops through _tally object
		for (let choice in _tally) {
			// if lowest is undefined, set equal to choice.
			if (!lowest) {
				lowest = choice;
			}
			// otherwise compare values
			else {
				// if the current choice has less votes than lowest,
				// then reset lowest to the current choice
				if (_tally[choice].length < _tally[lowest].length) {
					lowest = choice;
				}
			}
		}
		return lowest;
	} // end of _getLowestScoreCandidate definition

	function _eliminate (candidate) {
		// deletes eliminated candidate from _tally
		delete _tally[candidate];
	}


	function _generateInitialResultsData() {
		return {
			// copy of private _candidates array
			choices: [..._candidates],
			// two-level-deep copy of private _votes array
			submitted_ballots: _votes.map(vote => [...vote])
		};
	}

	function _processResultsCalculation(// default parameter values:
																			votesToCount = _votes.map(vote => [...vote]),
																			roundNum = 1,
																			resultsData = _generateInitialResultsData() ) {

		// ================== Tally Votes ==================

		_sortVotes(votesToCount);
		
		console.log('currentTally at round ' + roundNum + '\n', _tally);

		// ============ Build resultsData Object ============

		// sets round-specific data (useful for election analytics and results verification)
		resultsData[`round_${roundNum}`] = {
			// winner might be returned as null or not null depending on _tally
			winner: _getMajorityVotesCandidate(),
			// needs deep copy
			tally: JSON.parse(JSON.stringify(_tally)),
			// eliminated set initially to null (may change below)
			eliminated: null
		};


		// ============= Determine Return Value =============
		// ============ (and whether to recurse) ============

		// if the round has a winner
		if (resultsData[`round_${roundNum}`].winner) {
			// set overall winner equal to round winner
			resultsData.winner = resultsData[`round_${roundNum}`].winner;
			// return resultsData
			return resultsData;
		}

		// if no winner, then find who had received the least number of votes in the round.
		const eliminated = _getLowestScoreCandidate();
		console.log('eliminated', eliminated);

		// extracts votesForEliminated from _tally at eliminated key (2-level-deep copy)
		const votesForEliminated = _tally[eliminated].map(vote => [...vote]);
		
		// eliminates candidate with least number of votes from _tally (deletes property)
		_eliminate(eliminated);

		// adds eliminated to resultsData object at the current round.
		resultsData[`round_${roundNum}`].eliminated = eliminated;

		// console.log('resultsData at end of round' + roundNum + '\n', resultsData);

		// if it's reached this point, then it means a winner has yet to be determined.
		// then the function should call itself recursively, making sure to pass on resultsData,
		// votesForEliminated and roundNum so as to continue them in the next rounds.
		return _processResultsCalculation(votesForEliminated,
																			++roundNum,
																			resultsData );

	} // end of _processResultsCalculation

	// ******************************************************************


	// ************************ Object to Return ************************

	const tallyPrototype = {
		calculate() {
			return _processResultsCalculation();
		}
	};

	return Object.assign({}, tallyPrototype);

	// ******************************************************************

} // end of createTally

module.exports = createTally;