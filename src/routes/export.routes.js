const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { exportVerifiedCsv } = require('../controllers/export.controller');

const router = express.Router();

router.get('/verified.csv', requireAuth, requireRole('admin', 'faculty'), exportVerifiedCsv);

module.exports = router;


