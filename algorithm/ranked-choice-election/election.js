// dependencies
const createTally = require('./assets/tally.js');

// createRankedChoiceElection returns an object with methods that have privileged access
// to private variables (achieved by creating a closure)
function createRankedChoiceElection () {

	// ****************  PRIVATE VARIABLES IN CLOSURE ****************

	// creates private array "_choices" (list of candidates)
	let _choices = [];

	// _votes array is an array of arrays (each member array represents ranked-choice vote)
	let _votes = [];

	// initializes _electionResults as null until the user of the API calls calculateResult()
	// (enabling data caching to save time, rather than calculating again something that's already
	// been calculated).
	let _electionResults = null;


	// **************** PROTOTYPE OF OBJECT TO RETURN ****************

	const electionPrototype = {
		// returns copy of choices array rather than ref to it so it can't be mutated
		getChoices() {
			return [..._choices];
		},
		getVotes() {
			// returns deep copy of _votes array (array of arrays) to avoid mutation
			return _votes.map(vote => [...vote]);
		},
		setChoices(choicesArg) {
			// sets _choices equal to a copy of the array argument
			_choices = [...choicesArg];
		},
		setVotes(votesArg) {
			// sets votes equal to a two-level-deep copy of the votesArg array
			_votes = votesArg.map(vote => [...vote]);
		},
		addRankedVote(vote) {
			// pushes copy of incoming vote array
			_votes.push([...vote]);
		},
		calculateResult() {
			// if there are _electionResults already cached, then just return it.
			if (_electionResults) {
				// returns deep copy
				return JSON.parse(JSON.stringify(_electionResults));
			}
			// if _electionResults have not been calculated yet for this election instance,
			// then create a new tally instance and set the private _electionResults
			// to the result of its calculation.
			else {
				const rankedChoiceTally = createTally(_choices, _votes);

				_electionResults = rankedChoiceTally.calculate();

				return JSON.parse(JSON.stringify(_electionResults));
			}
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