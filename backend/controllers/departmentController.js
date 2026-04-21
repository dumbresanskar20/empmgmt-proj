const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public (so signup form can fetch them)
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
  try {
    const { name, description, headName } = req.body;
    if (!name) return res.status(400).json({ message: 'Department name is required' });

    const exists = await Department.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (exists) return res.status(400).json({ message: 'Department already exists' });

    const dept = await Department.create({ name, description, headName });
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });

    const { name, description, headName, isActive } = req.body;
    if (name) dept.name = name;
    if (description !== undefined) dept.description = description;
    if (headName !== undefined) dept.headName = headName;
    if (isActive !== undefined) dept.isActive = isActive;

    await dept.save();
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    await dept.deleteOne();
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
