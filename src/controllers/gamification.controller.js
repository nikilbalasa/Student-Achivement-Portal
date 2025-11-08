const Gamification = require('../models/Gamification');
const Badge = require('../models/Badge');
const Challenge = require('../models/Challenge');
const Leaderboard = require('../models/Leaderboard');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

// Point calculation based on achievement level and status
const POINT_VALUES = {
  college: 10,
  department: 20,
  state: 50,
  national: 100,
  international: 200,
};

// Calculate points for an achievement
function calculatePoints(achievement) {
  if (achievement.status !== 'approved') return 0;
  return POINT_VALUES[achievement.level] || 10;
}

// Get or create gamification record for user
async function getOrCreateGamification(userId) {
  let gamification = await Gamification.findOne({ user: userId })
    .populate('badges', 'name icon rarity');
  
  if (!gamification) {
    gamification = await Gamification.create({
      user: userId,
      totalPoints: 0,
      currentLevel: 1,
      pointsToNextLevel: 100,
    });
  }
  return gamification;
}

// Update user's gamification when achievement is verified
async function updateUserGamification(userId) {
  const achievements = await Achievement.find({ student: userId });
  
  let totalPoints = 0;
  const achievementsCount = {
    approved: 0,
    pending: 0,
    rejected: 0,
  };

  achievements.forEach(achievement => {
    if (achievement.status === 'approved') {
      totalPoints += calculatePoints(achievement);
      achievementsCount.approved++;
    } else if (achievement.status === 'pending') {
      achievementsCount.pending++;
    } else {
      achievementsCount.rejected++;
    }
  });

  const gamification = await getOrCreateGamification(userId);
  const oldLevel = gamification.currentLevel;
  
  gamification.totalPoints = totalPoints;
  gamification.currentLevel = gamification.calculateLevel();
  gamification.pointsToNextLevel = gamification.calculatePointsToNextLevel();
  gamification.achievementsCount = achievementsCount;
  gamification.lastUpdated = new Date();
  
  await gamification.save();

  // Check for level up
  if (gamification.currentLevel > oldLevel) {
    // Check for badge unlocks
    await checkBadgeUnlocks(userId, gamification);
  }

  // Update leaderboards
  await updateLeaderboards(userId);

  return gamification;
}

// Check and assign badges
async function checkBadgeUnlocks(userId, gamification) {
  const badges = await Badge.find({ isActive: true });
  const userBadges = gamification.badges.map(b => b._id.toString());
  
  for (const badge of badges) {
    if (userBadges.includes(badge._id.toString())) continue;

    let shouldUnlock = false;

    switch (badge.criteria.type) {
      case 'achievement_count':
        shouldUnlock = gamification.achievementsCount.approved >= badge.criteria.value;
        break;
      case 'points':
        shouldUnlock = gamification.totalPoints >= badge.criteria.value;
        break;
      case 'level':
        shouldUnlock = gamification.currentLevel >= badge.criteria.value;
        break;
      case 'category':
        const categoryCount = await Achievement.countDocuments({
          student: userId,
          category: badge.criteria.category,
          status: 'approved',
        });
        shouldUnlock = categoryCount >= (badge.criteria.value || 1);
        break;
    }

    if (shouldUnlock) {
      gamification.badges.push(badge._id);
      gamification.totalPoints += badge.points || 0;
      await gamification.save();
      
      // Recalculate level after badge points
      gamification.currentLevel = gamification.calculateLevel();
      gamification.pointsToNextLevel = gamification.calculatePointsToNextLevel();
      await gamification.save();
    }
  }
}

// Update leaderboards
async function updateLeaderboards(userId) {
  const user = await User.findById(userId);
  const gamification = await Gamification.findOne({ user: userId });
  
  if (!user || !gamification) return;

  // Update global leaderboard
  await Leaderboard.findOneAndUpdate(
    { user: userId, 'filter.type': 'global' },
    {
      user: userId,
      totalPoints: gamification.totalPoints,
      level: gamification.currentLevel,
      'filter.type': 'global',
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  // Update department leaderboard
  if (user.department) {
    await Leaderboard.findOneAndUpdate(
      { user: userId, 'filter.type': 'department', 'filter.value': user.department },
      {
        user: userId,
        totalPoints: gamification.totalPoints,
        level: gamification.currentLevel,
        'filter.type': 'department',
        'filter.value': user.department,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );
  }

  // Recalculate ranks
  await recalculateRanks();
}

// Recalculate ranks for all leaderboards
async function recalculateRanks() {
  const filters = [
    { type: 'global' },
  ];

  // Get all departments
  const departments = await User.distinct('department');
  departments.forEach(dept => {
    if (dept) filters.push({ type: 'department', value: dept });
  });

  for (const filter of filters) {
    const query = { 'filter.type': filter.type };
    if (filter.value) query['filter.value'] = filter.value;

    const leaderboard = await Leaderboard.find(query)
      .sort({ totalPoints: -1, level: -1 })
      .lean();

    let rank = 1;
    for (const entry of leaderboard) {
      await Leaderboard.findByIdAndUpdate(entry._id, { rank });
      rank++;
    }
  }
}

// Get user gamification stats
async function getUserStats(req, res, next) {
  try {
    const gamification = await getOrCreateGamification(req.user.id);
    await updateUserGamification(req.user.id);
    
    const updated = await Gamification.findById(gamification._id)
      .populate('badges', 'name icon rarity description');
    
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Get leaderboard
async function getLeaderboard(req, res, next) {
  try {
    const { type = 'global', value } = req.query;
    
    const query = { 'filter.type': type };
    if (value) query['filter.value'] = value;

    const leaderboard = await Leaderboard.find(query)
      .populate('user', 'name email department enrollmentNumber')
      .sort({ rank: 1 })
      .limit(100);

    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
}

// Get user's rank
async function getUserRank(req, res, next) {
  try {
    const { type = 'global', value } = req.query;
    
    const query = { 'filter.type': type, user: req.user.id };
    if (value) query['filter.value'] = value;

    const entry = await Leaderboard.findOne(query)
      .populate('user', 'name email department');
    
    if (!entry) {
      return res.json({ rank: null, totalParticipants: 0 });
    }

    const totalParticipants = await Leaderboard.countDocuments({
      'filter.type': type,
      ...(value ? { 'filter.value': value } : {}),
    });

    res.json({
      rank: entry.rank,
      totalPoints: entry.totalPoints,
      level: entry.level,
      totalParticipants,
    });
  } catch (err) {
    next(err);
  }
}

// Get active challenges
async function getActiveChallenges(req, res, next) {
  try {
    const now = new Date();
    const challenges = await Challenge.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .populate('badge', 'name icon rarity')
      .populate('category', 'name')
      .sort({ startDate: -1 });

    // Add user progress
    const challengesWithProgress = await Promise.all(
      challenges.map(async (challenge) => {
        const participant = challenge.participants.find(
          p => p.user.toString() === req.user.id
        );

        let progress = 0;
        if (participant) {
          progress = participant.progress;
        } else {
          // Calculate progress
          switch (challenge.type) {
            case 'achievement_count':
              progress = await Achievement.countDocuments({
                student: req.user.id,
                status: 'approved',
                ...(challenge.category ? { category: challenge.category } : {}),
                date: { $gte: challenge.startDate, $lte: challenge.endDate },
              });
              break;
            case 'points':
              const gamification = await getOrCreateGamification(req.user.id);
              progress = gamification.totalPoints;
              break;
          }
        }

        return {
          ...challenge.toObject(),
          progress,
          completed: participant?.completed || false,
        };
      })
    );

    res.json(challengesWithProgress);
  } catch (err) {
    next(err);
  }
}

// Join challenge
async function joinChallenge(req, res, next) {
  try {
    const { challengeId } = req.params;
    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const now = new Date();
    if (now < challenge.startDate || now > challenge.endDate) {
      return res.status(400).json({ message: 'Challenge is not active' });
    }

    const existingParticipant = challenge.participants.find(
      p => p.user.toString() === req.user.id
    );

    if (existingParticipant) {
      return res.json({ message: 'Already joined this challenge', challenge });
    }

    challenge.participants.push({
      user: req.user.id,
      progress: 0,
      completed: false,
    });

    await challenge.save();
    res.json(challenge);
  } catch (err) {
    next(err);
  }
}

// Update challenge progress
async function updateChallengeProgress(challengeId, userId) {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) return;

  const participant = challenge.participants.find(
    p => p.user.toString() === userId.toString()
  );

  if (!participant) return;

  let progress = 0;
  switch (challenge.type) {
    case 'achievement_count':
      progress = await Achievement.countDocuments({
        student: userId,
        status: 'approved',
        ...(challenge.category ? { category: challenge.category } : {}),
        date: { $gte: challenge.startDate, $lte: challenge.endDate },
      });
      break;
    case 'points':
      const gamification = await getOrCreateGamification(userId);
      progress = gamification.totalPoints;
      break;
  }

  participant.progress = progress;
  participant.completed = progress >= challenge.target;

  if (participant.completed && !participant.completedAt) {
    participant.completedAt = new Date();
    
    // Award points and badge
    const userGamification = await getOrCreateGamification(userId);
    userGamification.totalPoints += challenge.rewardPoints || 0;
    
    if (challenge.badge) {
      if (!userGamification.badges.includes(challenge.badge)) {
        userGamification.badges.push(challenge.badge);
      }
    }
    
    await userGamification.save();
    await updateLeaderboards(userId);
  }

  await challenge.save();
}

module.exports = {
  getUserStats,
  getLeaderboard,
  getUserRank,
  getActiveChallenges,
  joinChallenge,
  updateUserGamification,
  updateChallengeProgress,
  calculatePoints,
};

