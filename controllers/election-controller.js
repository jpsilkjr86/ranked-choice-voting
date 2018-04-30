const sampleElection = require('../algorithm/sample-election.js');

module.exports = {
    sample: (req, res) => {
        res.json(sampleElection());
        // res.send(JSON.stringify(sampleElection()));
    }
}