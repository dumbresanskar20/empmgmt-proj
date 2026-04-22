const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config();

// Use a function to return the storage configuration
// This allows us to use the existing mongoose connection
const createStorage = (collectionName) => {
  return new GridFsStorage({
    // Share the existing mongoose connection
    db: mongoose.connection.asPromise().then(() => mongoose.connection.db),
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) return reject(err);
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
            metadata: {
              originalName: file.originalname,
              uploadDate: new Date(),
              fieldName: file.fieldname
            }
          };
          resolve(fileInfo);
        });
      });
    }
  });
};

const documentStorage = createStorage('documents');
const profileStorage = createStorage('profiles');

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Supported: images, PDF, Word, Excel, TXT'), false);
  }
};

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for profile photo'), false);
  }
};

exports.uploadDocuments = multer({
  storage: documentStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).array('documents', 10);

exports.uploadProfile = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('profileImage');
