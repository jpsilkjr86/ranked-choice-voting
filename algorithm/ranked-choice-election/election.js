// dependencies
const calculateRankedChoiceElectionResults = require('./assets/calculate.js');

// createRankedChoiceElection returns an object with methods that have privileged access
// to private variables (achieved by creating a closure)
function createRankedChoiceElection () {

	// ****************  PRIVATE VARIABLES IN CLOSURE ****************

	// creates private array "_candidates" (list of candidates)
	let _candidates = [];

	// _votes array is an array of arrays (each member array represents ranked-choice vote)
	let _votes = [];

	// initializes _electionResults as null (changes when getResults() is called)
	// (enabling data caching to save time, rather than calculating again something that's already
	// been calculated).
	let _electionResults = null;

	// resets private variable _electionResults to null
	const _resetResultsToNull = () => {
		_electionResults = null;
	};

	// **************** PROTOTYPE OF OBJECT TO RETURN ****************

	const electionPrototype = {
		// returns copy of candidates array rather than ref to it so it can't be mutated
		getCandidates() {
			return [..._candidates];
		},
		getVotes() {
			// returns deep copy of _votes array (array of arrays) to avoid mutation
			return _votes.map(vote => [...vote]);
		},
		setCandidates(candidatesArg) {
			// always resets results to null every time there's a change in a local variable value
			_resetResultsToNull();
			// sets _candidates equal to a copy of the array argument
			_candidates = [...candidatesArg];
		},
		setVotes(votesArg) {
			// always resets results to null every time there's a change in a local variable value
			_resetResultsToNull();
			// sets votes equal to a two-level-deep copy of the votesArg array
			_votes = votesArg.map(vote => [...vote]);
		},
		addRankedVote(vote) {
			// always resets results to null every time there's a change in a local variable value
			_resetResultsToNull();
			// pushes copy of incoming vote array
			_votes.push([...vote]);
		},
		getResults() {
			// if _votes or _candidates is null, throws exception
			if (!_candidates || !_votes) {
				throw new Error('Cannot calculate results for null candidates or null votes.')
			}
			// if there are _electionResults already cached, then just returns it.
			if (_electionResults) {
				// returns deep copy
				return JSON.parse(JSON.stringify(_electionResults));
			}
			// if _electionResults have not been calculated yet for this election instance,
			// then inovke calculateRankedChoiceElectionResults and set the private _electionResults
			// to the result of the calculation.
			_electionResults = calculateRankedChoiceElectionResults(_candidates, _votes);
			// returns deep copy
			return JSON.parse(JSON.stringify(_electionResults));
		}
	}; // end of electionPrototype


	// returns object prototypally inheriting electionPrototype methods that
	// have privileged access to private data above.
	return Object.assign({}, electionPrototype);

} // end of createRankedChoiceElection()

module.exports = createRankedChoiceElection;



/* Example votes:
[ [ 'Tacos', 'Burgers', 'Dumplings', 'Pizza' ],
  [ 'Tacos', 'Pizza', 'Burgers', 'Dumplings' ],
  [ 'Burgers', 'Dumplings', 'Tacos', 'Pizza' ],
  [ 'Burgers', 'Tacos', 'Pizza', 'Dumplings' ],
  [ 'Tacos', 'Burgers', 'Dumplings', 'Pizza' ],
  [ 'Tacos', 'Pizza', 'Dumplings', 'Burgers' ],
  [ 'Burgers', 'Dumplings', 'Tacos', 'Pizza' ],
  [ 'Dumplings', 'Tacos', 'Burgers', 'Pizza' ],
  [ 'Burgers', 'Pizza', 'Tacos', 'Dumplings' ],
  [ 'Tacos', 'Burgers', 'Pizza', 'Dumplings' ] ]
  */