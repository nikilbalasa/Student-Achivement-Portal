const Category = require('../models/Category');

async function createCategory(req, res, next) {
  try {
    const { name, description, type } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Category already exists' });
    const category = await Category.create({ name, description, type });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function listCategories(req, res, next) {
  try {
    const items = await Category.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const result = await Category.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createCategory, listCategories, updateCategory, deleteCategory };


