const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, default: '🏆' },
    rarity: { 
      type: String, 
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], 
      default: 'common' 
    },
    points: { type: Number, default: 0 },
    criteria: {
      type: { 
        type: String, 
        enum: ['achievement_count', 'points', 'category', 'level', 'department', 'custom'],
        required: true 
      },
      value: { type: mongoose.Schema.Types.Mixed },
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Rarity colors
BadgeSchema.statics.RARITY_COLORS = {
  common: '#9CA3AF',
  uncommon: '#10B981',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};

module.exports = mongoose.model('Badge', BadgeSchema);

