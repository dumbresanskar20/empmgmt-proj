const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { uploadDocuments } = require('../middleware/uploadMiddleware');

router.post('/signup', uploadDocuments, signup);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
