// imports react component classes
import React, { Component } from 'react';

// children components

// App is the parent component to the rest of the app and the primary state-holder
class App extends Component {
  // declares initial state without constructor
	state = {
		candidates: [],
		votes: [],
		results: null
	}

	render() {
		return (
			<div>
				Header
				<p>Welcome to the Ranked Choice Election App!</p>
				<p>What would you like to do?</p>
				<button>Start a New Election</button>
			</div>
		);
	}
}

export default App;