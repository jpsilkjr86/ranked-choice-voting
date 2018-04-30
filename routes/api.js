const express = require('express');
const router = express.Router();
const electionController = require('../controllers/election-controller');

router.get('/election/sample', electionController.sample);

module.exports = router;