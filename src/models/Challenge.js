const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['achievement_count', 'category', 'points', 'time_based'],
      required: true 
    },
    target: { type: Number, required: true },
    rewardPoints: { type: Number, default: 0 },
    badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    participants: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      progress: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Challenge', ChallengeSchema);

