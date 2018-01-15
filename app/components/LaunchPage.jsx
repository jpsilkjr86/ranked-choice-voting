// react dependencies
import React from 'react';

// children components
import CustomJumbotron from './CustomJumbotron';

// components from libraries
import { Grid, Button } from 'react-bootstrap';

const LaunchPage = () => (
  <CustomJumbotron background="tw-mountains">
		<Grid>
			<h1>Welcome!</h1>
			<p>What would you like to do?</p>
			<Button bsStyle="primary">Start a New Election</Button>
		</Grid>
	</CustomJumbotron>
);

export default LaunchPage;