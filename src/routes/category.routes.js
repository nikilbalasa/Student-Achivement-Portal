const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { createCategory, listCategories, updateCategory, deleteCategory } = require('../controllers/category.controller');

const router = express.Router();

router.get('/', listCategories);
router.post('/', requireAuth, requireRole('admin', 'faculty'), createCategory);
router.put('/:id', requireAuth, requireRole('admin', 'faculty'), updateCategory);
router.delete('/:id', requireAuth, requireRole('admin'), deleteCategory);

module.exports = router;


