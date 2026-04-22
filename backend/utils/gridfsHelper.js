const mongoose = require('mongoose');
const { Readable } = require('stream');
const crypto = require('crypto');
const path = require('path');

/**
 * Uploads a file buffer to GridFS
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} mimetype - File mimetype
 * @param {object} metadata - Optional metadata
 * @returns {Promise<object>} - Uploaded file info
 */
const uploadToGridFS = (buffer, originalName, mimetype, metadata = {}) => {
  return new Promise((resolve, reject) => {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalName);
    
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: mimetype,
      metadata: {
        ...metadata,
        originalName: originalName,
        uploadDate: new Date()
      }
    });

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    readableStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      reject(error);
    });

    uploadStream.on('finish', () => {
      resolve({
        id: uploadStream.id,
        filename: filename,
        originalName: originalName,
        mimetype: mimetype,
        path: `/api/files/${filename}`
      });
    });
  });
};

module.exports = { uploadToGridFS };
