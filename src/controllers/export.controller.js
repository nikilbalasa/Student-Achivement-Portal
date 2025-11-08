const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const Achievement = require('../models/Achievement');

async function exportVerifiedCsv(req, res, next) {
  try {
    const { department, from, to } = req.query;
    const filter = { status: 'approved' };
    if (department) filter.department = department;
    if (from || to) filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);

    const rows = await Achievement.find(filter)
      .populate('student', 'name email department enrollmentNumber')
      .populate('category', 'name type')
      .sort({ date: -1 })
      .lean();

    const tmpDir = path.join(__dirname, '..', '..', 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const filename = `verified-achievements-${Date.now()}.csv`;
    const filePath = path.join(tmpDir, filename);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'title', title: 'Title' },
        { id: 'studentName', title: 'Student Name' },
        { id: 'enrollmentNumber', title: 'Enrollment No.' },
        { id: 'email', title: 'Email' },
        { id: 'department', title: 'Department' },
        { id: 'category', title: 'Category' },
        { id: 'level', title: 'Level' },
        { id: 'date', title: 'Date' },
        { id: 'proofUrl', title: 'Proof URL' },
      ],
    });

    const data = rows.map((r) => ({
      title: r.title,
      studentName: r.student?.name || '',
      enrollmentNumber: r.student?.enrollmentNumber || '',
      email: r.student?.email || '',
      department: r.department || r.student?.department || '',
      category: r.category?.name || '',
      level: r.level,
      date: new Date(r.date).toISOString().split('T')[0],
      proofUrl: r.proofUrl || '',
    }));

    await csvWriter.writeRecords(data);

    res.download(filePath, filename, (err) => {
      if (err) return next(err);
      fs.unlink(filePath, () => {});
      return undefined;
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { exportVerifiedCsv };


