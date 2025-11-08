const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { categoryWiseCounts, departmentWiseCounts, timeline, facultyStats, categoryDetails, departmentDetails } = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/categories', requireAuth, requireRole('admin', 'faculty'), categoryWiseCounts);
router.get('/departments', requireAuth, requireRole('admin', 'faculty'), departmentWiseCounts);
router.get('/timeline', requireAuth, requireRole('admin', 'faculty'), timeline);
router.get('/faculty-stats', requireAuth, requireRole('admin'), facultyStats);
router.get('/category/:categoryId/details', requireAuth, requireRole('admin', 'faculty'), categoryDetails);
router.get('/department/:department/details', requireAuth, requireRole('admin', 'faculty'), departmentDetails);

module.exports = router;


