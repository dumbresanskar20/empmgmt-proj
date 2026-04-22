const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  getMyLeaveStats,
} = require('../controllers/leaveController');
const { uploadPrescription } = require('../middleware/uploadMiddleware');

// Employee routes
router.post('/', protect, uploadPrescription, applyLeave);
router.get('/my', protect, getMyLeaves);
router.get('/my/stats', protect, getMyLeaveStats);

// Admin routes
router.get('/', protect, adminOnly, getAllLeaves);
router.put('/:id/status', protect, adminOnly, updateLeaveStatus);

module.exports = router;
