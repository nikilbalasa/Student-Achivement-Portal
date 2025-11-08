const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  getUserStats,
  getLeaderboard,
  getUserRank,
  getActiveChallenges,
  joinChallenge,
} = require('../controllers/gamification.controller');

const router = express.Router();

// Get user's gamification stats
router.get('/stats', requireAuth, requireRole('student'), getUserStats);

// Get leaderboard
router.get('/leaderboard', requireAuth, requireRole('student', 'admin', 'faculty'), getLeaderboard);

// Get user's rank
router.get('/rank', requireAuth, requireRole('student'), getUserRank);

// Get active challenges
router.get('/challenges', requireAuth, requireRole('student'), getActiveChallenges);

// Join a challenge
router.post('/challenges/:challengeId/join', requireAuth, requireRole('student'), joinChallenge);

module.exports = router;

