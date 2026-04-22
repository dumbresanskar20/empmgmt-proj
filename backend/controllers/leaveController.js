const Leave = require('../models/Leave');
const User = require('../models/User');
const { uploadToGridFS } = require('../utils/gridfsHelper');

// @desc    Apply for leave (employee)
// @route   POST /api/leaves
// @access  Private/Employee
const applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;
    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'From date, to date and reason are required' });
    }

    const user = await User.findById(req.user._id);
    
    let prescriptionInfo = {};
    if (leaveType === 'sick' && req.file) {
      const uploadedFile = await uploadToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype, {
        type: 'prescription',
        employeeId: user.employeeId
      });
      prescriptionInfo = {
        prescriptionPath: uploadedFile.path,
        prescriptionFilename: uploadedFile.filename
      };
    } else if (leaveType === 'sick' && !req.file) {
      return res.status(400).json({ message: 'Prescription is required for sick leave' });
    }

    const leave = await Leave.create({
      userId: req.user._id,
      employeeId: user.employeeId,
      employeeName: user.name,
      leaveType: leaveType || 'casual',
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
      ...prescriptionInfo
    });

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get my leaves (employee)
// @route   GET /api/leaves/my
// @access  Private/Employee
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all leaves (admin)
// @route   GET /api/leaves
// @access  Private/Admin
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update leave status (admin)
// @route   PUT /api/leaves/:id/status
// @access  Private/Admin
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    leave.status = status;
    if (adminComment !== undefined) leave.adminComment = adminComment;
    await leave.save();

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get my leave stats (employee dashboard)
// @route   GET /api/leaves/my/stats
// @access  Private/Employee
const getMyLeaveStats = async (req, res) => {
  try {
    const total = await Leave.countDocuments({ userId: req.user._id });
    const approved = await Leave.countDocuments({ userId: req.user._id, status: 'approved' });
    const rejected = await Leave.countDocuments({ userId: req.user._id, status: 'rejected' });
    const pending = await Leave.countDocuments({ userId: req.user._id, status: 'pending' });

    // Monthly trend
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const trend = await Leave.aggregate([
      { $match: { userId: req.user._id, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ total, approved, rejected, pending, trend });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, getMyLeaveStats };
