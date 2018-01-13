// imports react component classes
import React, { Component } from 'react';

// children components

// StateContainer is the parent component to the rest of the app and the primary state-holder
class StateContainer extends Component {
  // declares initial state without constructor
	state = {
		foo: 'bar'
	}

	render() {
		return (
			<div className="jumbotron">
				{this.state.foo}
			</div>
		);
	}
}

export default StateContainer;