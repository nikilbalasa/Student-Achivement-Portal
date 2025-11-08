const Achievement = require('../models/Achievement');
const User = require('../models/User');

async function categoryWiseCounts(req, res, next) {
  try {
    const { department } = req.query;
    const match = { status: 'approved' };
    if (department) match.department = department;
    const data = await Achievement.aggregate([
      { $match: match },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { _id: 0, categoryId: '$category._id', name: '$category.name', type: '$category.type', count: 1 } },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function departmentWiseCounts(req, res, next) {
  try {
    const data = await Achievement.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $project: { _id: 0, department: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function timeline(req, res, next) {
  try {
    const { from, to } = req.query;
    const match = { status: 'approved' };
    if (from || to) match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) match.date.$lte = new Date(to);
    const data = await Achievement.aggregate([
      { $match: match },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function facultyStats(req, res, next) {
  try {
    const faculties = await User.find({ role: 'faculty' }).select('name email department');
    const stats = await Promise.all(
      faculties.map(async (faculty) => {
        const approved = await Achievement.countDocuments({ verifiedBy: faculty._id, status: 'approved' });
        const rejected = await Achievement.countDocuments({ verifiedBy: faculty._id, status: 'rejected' });
        return {
          id: faculty._id,
          name: faculty.name,
          email: faculty.email,
          department: faculty.department || 'N/A',
          approved,
          rejected,
          total: approved + rejected,
        };
      })
    );
    res.json({ totalFaculty: faculties.length, facultyStats: stats });
  } catch (err) {
    next(err);
  }
}

async function categoryDetails(req, res, next) {
  try {
    const { categoryId } = req.params;
    const achievements = await Achievement.find({ category: categoryId })
      .populate('student', 'name email department enrollmentNumber')
      .populate('category', 'name type')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });
    
    const enrolled = achievements.length;
    const accepted = achievements.filter(a => a.status === 'approved').length;
    const rejected = achievements.filter(a => a.status === 'rejected').length;
    const pending = achievements.filter(a => a.status === 'pending').length;
    
    res.json({
      categoryId,
      enrolled,
      accepted,
      rejected,
      pending,
      achievements: achievements.map(a => ({
        id: a._id,
        title: a.title,
        student: a.student,
        status: a.status,
        date: a.date,
        verifiedBy: a.verifiedBy,
        verifiedAt: a.verifiedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

async function departmentDetails(req, res, next) {
  try {
    const { department } = req.params;
    const achievements = await Achievement.find({ department })
      .populate('student', 'name email department enrollmentNumber')
      .populate('category', 'name type')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });
    
    const enrolled = achievements.length;
    const accepted = achievements.filter(a => a.status === 'approved').length;
    const rejected = achievements.filter(a => a.status === 'rejected').length;
    const pending = achievements.filter(a => a.status === 'pending').length;
    
    res.json({
      department,
      enrolled,
      accepted,
      rejected,
      pending,
      achievements: achievements.map(a => ({
        id: a._id,
        title: a.title,
        student: a.student,
        category: a.category,
        status: a.status,
        date: a.date,
        verifiedBy: a.verifiedBy,
        verifiedAt: a.verifiedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { categoryWiseCounts, departmentWiseCounts, timeline, facultyStats, categoryDetails, departmentDetails };


