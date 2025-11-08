const Achievement = require('../models/Achievement');
const Category = require('../models/Category');
const { updateUserGamification, updateChallengeProgress } = require('./gamification.controller');
// Local uploads only

async function createAchievement(req, res, next) {
  try {
    const { title, description, date, level, category, department } = req.body;
    if (!title || !date || !category) {
      return res.status(400).json({ message: 'title, date and category are required' });
    }
    const cat = await Category.findById(category);
    if (!cat) return res.status(400).json({ message: 'Invalid category' });

    let proofUrl;
    if (req.file) {
      proofUrl = `/uploads/${req.file.filename}`;
    }

    const achievement = await Achievement.create({
      title,
      description,
      date,
      level,
      category,
      proofUrl,
      student: req.user.id,
      department,
      status: 'pending',
    });
    res.status(201).json(achievement);
  } catch (err) {
    next(err);
  }
}

async function getMyAchievements(req, res, next) {
  try {
    const items = await Achievement.find({ student: req.user.id })
      .populate('category', 'name type')
      .sort({ date: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function updateMyAchievement(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const ach = await Achievement.findOne({ _id: id, student: req.user.id });
    if (!ach) return res.status(404).json({ message: 'Achievement not found' });
    if (ach.status !== 'pending') return res.status(400).json({ message: 'Only pending can be edited' });

    if (req.file) {
      updates.proofUrl = `/uploads/${req.file.filename}`;
    }

    Object.assign(ach, updates);
    await ach.save();
    res.json(ach);
  } catch (err) {
    next(err);
  }
}

async function deleteMyAchievement(req, res, next) {
  try {
    const { id } = req.params;
    const ach = await Achievement.findOne({ _id: id, student: req.user.id });
    if (!ach) return res.status(404).json({ message: 'Achievement not found' });
    if (ach.status !== 'pending') return res.status(400).json({ message: 'Only pending can be deleted' });
    await ach.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

async function listAll(req, res, next) {
  try {
    const { status, department, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (category) filter.category = category;
    const items = await Achievement.find(filter)
      .populate('student', 'name email department')
      .populate('category', 'name type')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function verifyAchievement(req, res, next) {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body; // approved or rejected
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const ach = await Achievement.findById(id);
    if (!ach) return res.status(404).json({ message: 'Achievement not found' });
    ach.status = status;
    ach.remarks = remarks;
    ach.verifiedBy = req.user.id;
    ach.verifiedAt = new Date();
    await ach.save();
    
    // Update gamification when achievement is verified
    if (status === 'approved') {
      await updateUserGamification(ach.student);
      
      // Update challenge progress for all active challenges
      const Challenge = require('../models/Challenge');
      const now = new Date();
      const activeChallenges = await Challenge.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      });
      
      for (const challenge of activeChallenges) {
        await updateChallengeProgress(challenge._id, ach.student);
      }
    }
    
    res.json(ach);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createAchievement,
  getMyAchievements,
  updateMyAchievement,
  deleteMyAchievement,
  listAll,
  verifyAchievement,
};


