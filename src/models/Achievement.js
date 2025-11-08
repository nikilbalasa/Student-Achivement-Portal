const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    level: { type: String, enum: ['college', 'department', 'state', 'national', 'international'], default: 'college' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    proofUrl: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, trim: true },
    remarks: { type: String, trim: true },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', AchievementSchema);


