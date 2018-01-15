// react dependencies
import React from 'react';

// children components
import CustomJumbotron from './CustomJumbotron';

// components from libraries
import { Grid, Row, Col, Button } from 'react-bootstrap';

import styles from './LaunchPage.css';

const Streamer = ({caption}) => (
	<div className={styles.streamer}>
		<h2 className={styles.caption}>{caption}</h2>
	</div>
);		

const LaunchPage = () => (
	<div>
	  <CustomJumbotron background="tw-mountains">
			<Grid>
				<h1>Ranked Choice Voting App</h1>
				<p>Create, manage and share your own ranked choice election in minutes!</p>
				<Button bsStyle="primary">Start a New Election</Button>
			</Grid>
		</CustomJumbotron>
		<Streamer caption="How Ranked Choice Elections Work"/>
		<Grid>
			<Row>
				<Col xs={12} sm={6}>
					<h3>Sub-Heading 1</h3>				
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
					  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
					  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
					  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
					  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
					  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				  </p>
				</Col>
				<Col xs={12} sm={6}>					
					<h3>Sub-Heading 2</h3>				
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
					  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
					  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
					  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
					  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
					  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				  </p>
				</Col>
			</Row>
		</Grid>
	</div>
);

export default LaunchPage;