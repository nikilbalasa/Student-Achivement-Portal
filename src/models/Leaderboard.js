const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalPoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rank: { type: Number },
    filter: {
      type: { 
        type: String, 
        enum: ['global', 'department', 'year', 'category'],
        default: 'global' 
      },
      value: { type: String }, // department name, year, category ID
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for efficient leaderboard queries
LeaderboardSchema.index({ 'filter.type': 1, 'filter.value': 1, totalPoints: -1 });
LeaderboardSchema.index({ user: 1, 'filter.type': 1, 'filter.value': 1 });

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);

