const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: ['academic', 'sports', 'technical', 'cultural', 'other'], default: 'other' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);


