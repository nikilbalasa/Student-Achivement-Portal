const mongoose = require('mongoose');

const GamificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalPoints: { type: Number, default: 0 },
    currentLevel: { type: Number, default: 1 },
    pointsToNextLevel: { type: Number, default: 100 },
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
    unlockedRewards: [{ type: String }],
    achievementsCount: {
      approved: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      rejected: { type: Number, default: 0 },
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Level thresholds (points required for each level)
GamificationSchema.statics.LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  3500,   // Level 7
  5000,   // Level 8
  7500,   // Level 9
  10000,  // Level 10
  15000,  // Level 11
  20000,  // Level 12
  30000,  // Level 13
  40000,  // Level 14
  50000,  // Level 15
];

// Calculate level from points
GamificationSchema.methods.calculateLevel = function() {
  const thresholds = this.constructor.LEVEL_THRESHOLDS;
  let level = 1;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (this.totalPoints >= thresholds[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
};

// Calculate points needed for next level
GamificationSchema.methods.calculatePointsToNextLevel = function() {
  const thresholds = this.constructor.LEVEL_THRESHOLDS;
  const currentLevel = this.calculateLevel();
  if (currentLevel >= thresholds.length) {
    return 0; // Max level
  }
  const nextLevelThreshold = thresholds[currentLevel];
  return Math.max(0, nextLevelThreshold - this.totalPoints);
};

module.exports = mongoose.model('Gamification', GamificationSchema);

