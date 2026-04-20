const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    documentType: {
      type: String,
      required: [true, 'Document type is required'],
      enum: ['Aadhar Card', 'PAN Card', 'Passport', 'Driving License', 'Utility Bills'],
    },
    filePath: { type: String, required: [true, 'File path is required'] },
    originalName: { type: String },
    fileSize: { type: Number },
    mimeType: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
