// react dependencies
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// children components
import Header from './components/Header';
import LaunchPage from './components/LaunchPage';

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
				<Header/>
				<main>
					<Switch>
						<Route component={LaunchPage}/>
					</Switch>
				</main>
			</div>
		);
	}
}

export default App;