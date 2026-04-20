const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/documentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('document'), uploadDocument);
router.get('/:employeeId', protect, getDocuments);
router.delete('/:id', protect, adminOnly, deleteDocument);

module.exports = router;
