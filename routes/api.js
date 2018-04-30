const express = require('express');
const router = express.Router();
const sampleElection = require('../algorithm/sample-election.js');

router.get('/sample', (req, res) => {
    res.json(sampleElection());
    // res.send(JSON.stringify(sampleElection()));
});

router.post('/election/new', (req, res) => {
    res.send('coming soon');
});

module.exports = router;