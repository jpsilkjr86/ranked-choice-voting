// dependencies
const sampleElection = require('../algorithm/sample-election.js');

// exports as function which takes in app as parameter
module.exports = app => {

	app.get('/sample', (req, res) => {
		res.json(sampleElection());
		// res.send(JSON.stringify(sampleElection()));
	});

	app.post('/election/new', (req, res) => {
		res.send('coming soon');
	});
};