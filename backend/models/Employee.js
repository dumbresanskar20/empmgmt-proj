const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    department: { type: String, required: [true, 'Department is required'], trim: true },
    position: { type: String, required: [true, 'Position is required'], trim: true },
    salary: { type: Number, required: [true, 'Salary is required'], min: 0 },
    joiningDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
