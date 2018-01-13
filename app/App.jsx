// react dependencies
import React, { Component } from 'react';

// components from libraries
import { Grid, Button } from 'react-bootstrap';

// children components
import Header from './components/Header';
import CustomJumbotron from './components/CustomJumbotron';

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
					<CustomJumbotron background="alishan">
						<Grid>
							<h1>Welcome to the Ranked Choice Election App!</h1>
							<p>What would you like to do?</p>
							<Button bsStyle="primary">Start a New Election</Button>
						</Grid>
					</CustomJumbotron>
				</main>
			</div>
		);
	}
}

export default App;