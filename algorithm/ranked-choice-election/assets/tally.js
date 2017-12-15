// dependencies
const createResultsHelper = require('./tally/results-helper.js');
const createRunoff = require('./runoff.js');

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

	/* Intended strucutre of _tally object: {
	
		candiatateOne: [~~], // (array holdes the ballots counted toward that candidate)
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
	const _sortVotes = votes => {
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
	}; // end of _sortVotes definition

	// checks if any of the candidates has a majority number of votes and, if so, returns the winner.
	const _getMajorityVotesCandidate = () => {
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
	}; // end of _getMajorityVotesCandidate definition

	// returns the name of the candidate who has received the least number of votes.
	const _getLowestScoreCandidates = () => {
		// sets lowest as an initially empty array
		let lowest = [];
		// loops through _tally object
		for (let choice in _tally) {
			// if there are no elements in lowest, push the choice (first iteration)
			if (!lowest.length) {
				lowest.push(choice);
			}
			// otherwise compare values
			else {
				// if the current choice has fewer votes than lowest[0],
				// then empties lowest array and sets lowest[0] to the current choice
				if (_tally[choice].length < _tally[lowest[0]].length) {
					lowest = [];
					lowest.push(choice);
				}
				// if the current choice has the same number of votes as lowest[0],
				// then pushes current choice onto the lowest array
				else if (_tally[choice].length == _tally[lowest[0]].length) {
					lowest.push(choice);
				}
				// if neither of the above two conditions are true, then just continues loop.
			}
		}
		return lowest;
	}; // end of _getLowestScoreCandidates definition

	const _eliminate = candidate => {
		// deletes eliminated candidate from _tally
		delete _tally[candidate];
	};

	// ********** main algorithm of ranked choice election (recursive) **********
	const _processResultsCalculation = function (	// default parameter values:
																				votesToCount = _votes.map(vote => [...vote]),
																				roundNum = 1,
																				results = createResultsHelper(_candidates, _votes) ) {

		// sorts votes to active (non-eliminated) candidate who earned them
		_sortVotes(votesToCount);
		
		console.log('currentTally at round ' + roundNum + '\n', _tally);

		// retrieves candidate who has more than 50% of the vote, if exists (if not then returns null)
		const winner = _getMajorityVotesCandidate();

		// adds round data to the results data
		results.addRoundData({
			roundNum: roundNum,
			winner: winner, // could be null or object
			tally: _tally
		});

		// if there's a winner, adds it to the results data and returns the data (end of calculation)
		if (winner) {
			// sets eliminatedCandidates to array of any candidate not equal to the winner
			const eliminatedCandidates = Object.keys(_tally).filter(c => c != Object.keys(winner)[0]);
			// adds the winner of the whole election to the results data
			results.addElectionWinner(winner);
			// adds eliminated to the round data
			results.addEliminatedToRoundData(eliminatedCandidates, roundNum);
			// returns the results data (end of calculation)
			return results.getData();
		}

		// if the function has reached this point, then there's no winner, and
		// so it needs to determine a single candidate to eliminate. Logic as follows:

		// gets candidates with least number of votes
		// (returns array, which may have 1 or more elements)
		const lowestScoreCandidates =  _getLowestScoreCandidates();
		console.log('lowestScoreCandidates', lowestScoreCandidates, '\n');
		// temp variable
		let eliminated;

		// if there's a tie for the lowest number of votes, proceed to runoff.
		if (lowestScoreCandidates.length > 1) {
			console.log('tie: proceeding to runoff election.', '\n');

			// creates a runoff election
			const runoff = createRunoff(lowestScoreCandidates, _votes);

			// calculates runoff election results
			const runoffResults = runoff.calculate();

			// adds runoff results to results data at roundNum
			results.addRunoffResultsToRound({ runoffResults, roundNum });

			// sets local variable eliminated to runoffResults.eliminated
			eliminated = runoffResults.eliminated;
		}
		// if there's only one element in lowestScoreCandidates, then set
		// eliminated equal to lowestScoreCandidates[0] (the only element in array).
		else {
			eliminated = lowestScoreCandidates[0];
		}			

		console.log('eliminated', eliminated);

		// adds eliminated to the round data
		results.addEliminatedToRoundData(eliminated, roundNum);

		// if function has reached this point, then it now needs extract all votes counted to the
		// eliminated candidate, remove the eliminated candidate from the candidate pool,
		// and redistribute their votes among the remaining active candidates.

		// extracts votesForEliminated from _tally at eliminated key (2-level-deep copy)
		const votesForEliminated = _tally[eliminated].map(vote => [...vote]);
		
		// eliminates candidate with least number of votes from _tally (deletes property)
		_eliminate(eliminated);


		// the function calls itself recursively, making sure to pass on results,
		// votesForEliminated and roundNum so as to continue building upon them in the next rounds.
		return _processResultsCalculation(votesForEliminated,
																			++roundNum,
																			results );

	}; // end of _processResultsCalculation

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


/*
// sorts votes to active (non-eliminated) candidate who earned them
		_sortVotes(votesToCount);

		// retrieves candidate who has more than 50% of the vote, if exists
		const winner = _getMajorityVotesCandidate();

		// if no winner, check for ties among eliminated candidates

		// determines who has been eliminated, if anyone. if no winner, then sets eliminated
		// equal to the candidate who received the least number of votes. if there is a
		// winner, then sets it equal to null.
		const eliminated = (winner == null ? _getLowestScoreCandidate() : null);

		// adds round data to results data
		results.addRoundData(roundNum, winner, eliminated, _tally);

		console.log('currentTally at round ' + roundNum + '\n', _tally);
		console.log('eliminated', eliminated);

		// if there's a winner, adds it to the results data and returns the data (end of calculation)
		if (winner) {
			results.addElectionWinner(winner);
			return results.getData();
		}
		*/


		// // 	console.log('Object.keys(_tally)', Object.keys(_tally));
		// // 	console.log('Object.keys(_tally).length', Object.keys(_tally).length);
		// // 	console.log('typeof Object.keys(_tally).length', typeof Object.keys(_tally).length);
		// // 	console.log('Object.keys(_tally).length == 2', Object.keys(_tally).length == 2);
		// // if there's only one candidate left besides eliminated one
		// if (Object.keys(_tally).length == 2) {
			
		// 	// winner is set as the candidate who has not been eliminated
		// 	const winningCandidate = (
		// 		Object.keys(_tally)[0] != eliminated
		// 			? Object.keys(_tally)[0]
		// 			: Object.keys(_tally)[1]
		// 	);

		// 	// adds the winner of the whole election to the results data
		// 	results.addElectionWinner( { [winningCandidate]: _tally[winningCandidate].length } );
		// 	// returns the results data (end of calculation)
		// 	return results.getData();
		// }