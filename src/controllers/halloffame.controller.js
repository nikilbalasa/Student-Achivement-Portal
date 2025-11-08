const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Gamification = require('../models/Gamification');

// Get top achievers for Hall of Fame
async function getTopAchievers(req, res, next) {
  try {
    const { category, limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = { status: 'approved' };
    if (category && category !== 'all') {
      // Find category by name or type
      const Category = require('../models/Category');
      const categoryDoc = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(category, 'i') } },
          { type: { $regex: new RegExp(category, 'i') } }
        ]
      });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        // Try to match by type if no category found
        const categoriesByType = await Category.find({
          type: { $regex: new RegExp(category, 'i') }
        });
        if (categoriesByType.length > 0) {
          filter.category = { $in: categoriesByType.map(c => c._id) };
        }
      }
    }

    // Get achievements with student and category populated
    const achievements = await Achievement.find(filter)
      .populate('student', 'name email department enrollmentNumber')
      .populate('category', 'name type')
      .populate('verifiedBy', 'name')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get top 5 achievers by points for featured carousel
    const topAchievers = await Gamification.find({})
      .populate('user', 'name email department enrollmentNumber')
      .sort({ totalPoints: -1, currentLevel: -1 })
      .limit(5);

    // Get their recent achievements
    const featuredAchievements = await Promise.all(
      topAchievers.map(async (gamification) => {
        const recentAchievement = await Achievement.findOne({
          student: gamification.user._id,
          status: 'approved'
        })
          .populate('category', 'name type')
          .sort({ date: -1 })
          .limit(1);
        
        return {
          user: gamification.user,
          points: gamification.totalPoints,
          level: gamification.currentLevel,
          achievement: recentAchievement,
        };
      })
    );

    res.json({
      featured: featuredAchievements.filter(f => f.achievement),
      achievements: achievements.map(a => ({
        id: a._id,
        title: a.title,
        description: a.description,
        date: a.date,
        level: a.level,
        student: a.student,
        category: a.category,
        verifiedBy: a.verifiedBy,
        verifiedAt: a.verifiedAt,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Achievement.countDocuments(filter),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTopAchievers };

