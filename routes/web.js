const express = require('express');
const router = express.Router();

// catch-all get route to ensure SPA works correctly (with react-router)
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '../public/index.html'));
});

module.exports = router;