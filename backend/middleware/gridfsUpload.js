const multer = require('multer');
const { uploadToGridFS } = require('../utils/gridfsHelper');

// Use memory storage
const storage = multer.memoryStorage();

// This middleware mimics the behavior of the old gridfs-storage but uses the stable GridFSBucket streaming
// to avoid the "Unsupported BSON version" error in Mongoose 8.
const uploadGridFS = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Helper for single file upload
exports.uploadSingle = uploadGridFS.single('file');

// Middleware to handle the actual GridFS streaming after multer-memory-storage
exports.gridfsHandler = async (req, res, next) => {
  try {
    if (!req.file) return next();
    
    const uploadedFile = await uploadToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);
    req.file.gridfs = uploadedFile; // Attach GridFS info to req.file
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = uploadGridFS;
