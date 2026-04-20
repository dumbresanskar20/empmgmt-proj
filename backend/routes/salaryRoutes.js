const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  addOrUpdateSalary,
  getAllSalaries,
  getMySalaries,
  getMySalaryStats,
} = require('../controllers/salaryController');

// Employee
router.get('/my', protect, getMySalaries);
router.get('/my/stats', protect, getMySalaryStats);

// Admin
router.get('/', protect, adminOnly, getAllSalaries);
router.post('/', protect, adminOnly, addOrUpdateSalary);

module.exports = router;
