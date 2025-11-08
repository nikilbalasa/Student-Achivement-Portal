const express = require('express');
const { getTopAchievers } = require('../controllers/halloffame.controller');

const router = express.Router();

// Public route - no authentication required
router.get('/achievers', getTopAchievers);

module.exports = router;

