const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { upload } = require('../utils/upload');
const {
  createAchievement,
  getMyAchievements,
  updateMyAchievement,
  deleteMyAchievement,
  listAll,
  verifyAchievement,
} = require('../controllers/achievement.controller');

const router = express.Router();

// Student routes
router.post('/', requireAuth, upload.single('proof'), createAchievement);
router.get('/me', requireAuth, getMyAchievements);
router.put('/:id', requireAuth, upload.single('proof'), updateMyAchievement);
router.delete('/:id', requireAuth, deleteMyAchievement);

// Admin/Faculty routes
router.get('/', requireAuth, requireRole('admin', 'faculty'), listAll);
router.post('/:id/verify', requireAuth, requireRole('admin', 'faculty'), verifyAchievement);

module.exports = router;


