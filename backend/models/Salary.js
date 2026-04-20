const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true },
    employeeName: { type: String },
    month: { type: String }, // e.g. "2024-04"
    basic: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Auto calculate netSalary before save
salarySchema.pre('save', function (next) {
  this.netSalary = (this.basic || 0) + (this.bonus || 0) - (this.deductions || 0);
  next();
});

module.exports = mongoose.model('Salary', salarySchema);
