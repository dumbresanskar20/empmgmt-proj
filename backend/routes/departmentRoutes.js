const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');

// Public: signup form fetches departments
router.get('/', getDepartments);

// Admin only
router.post('/', protect, adminOnly, createDepartment);
router.put('/:id', protect, adminOnly, updateDepartment);
router.delete('/:id', protect, adminOnly, deleteDepartment);

module.exports = router;
