const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// @desc    Upload a document
// @route   POST /api/documents
// @access  Private
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const { employeeId, documentType } = req.body;

    if (!employeeId || !documentType) {
      res.status(400);
      throw new Error('Employee ID and document type are required');
    }

    const document = await Document.create({
      employeeId,
      documentType,
      filePath: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json(document);
  } catch (err) {
    next(err);
  }
};

// @desc    Get documents for an employee
// @route   GET /api/documents/:employeeId
// @access  Private
const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ employeeId: req.params.employeeId }).populate(
      'employeeId',
      'name email'
    );
    res.json(documents);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private/Admin
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }

    // Remove file from disk
    const filePath = path.join(__dirname, '..', 'uploads', document.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadDocument, getDocuments, deleteDocument };
