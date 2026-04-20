const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  uploadDocuments,
  getMyStats,
} = require('../controllers/employeeController');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);
router.put('/profile-image', protect, upload.uploadProfile, uploadProfileImage);
router.post('/documents', protect, upload.uploadDocuments, uploadDocuments);
router.get('/stats', protect, getMyStats);

module.exports = router;
