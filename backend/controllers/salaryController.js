const Salary = require('../models/Salary');
const User = require('../models/User');

// @desc    Add or update salary (admin)
// @route   POST /api/salaries
// @access  Private/Admin
const addOrUpdateSalary = async (req, res) => {
  try {
    const { userId, basic, bonus, deductions, month, notes } = req.body;
    if (!userId || !basic) {
      return res.status(400).json({ message: 'User and basic salary are required' });
    }

    const emp = await User.findById(userId).select('name employeeId');
    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    const currentMonth = month || new Date().toISOString().slice(0, 7);

    // Check if salary record exists for this month
    let salary = await Salary.findOne({ userId, month: currentMonth });

    if (salary) {
      salary.basic = Number(basic) || 0;
      salary.bonus = Number(bonus) || 0;
      salary.deductions = Number(deductions) || 0;
      salary.notes = notes || '';
      salary.employeeName = emp.name;
      await salary.save();
    } else {
      salary = await Salary.create({
        userId,
        employeeId: emp.employeeId,
        employeeName: emp.name,
        month: currentMonth,
        basic: Number(basic) || 0,
        bonus: Number(bonus) || 0,
        deductions: Number(deductions) || 0,
        notes: notes || '',
      });
    }

    res.status(201).json(salary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all salaries (admin)
// @route   GET /api/salaries
// @access  Private/Admin
const getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().sort({ createdAt: -1 });
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get my salary records (employee)
// @route   GET /api/salaries/my
// @access  Private/Employee
const getMySalaries = async (req, res) => {
  try {
    const salaries = await Salary.find({ userId: req.user._id }).sort({ month: -1 });
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get my salary stats (employee)
// @route   GET /api/salaries/my/stats
// @access  Private/Employee
const getMySalaryStats = async (req, res) => {
  try {
    const salaries = await Salary.find({ userId: req.user._id }).sort({ month: 1 });
    const totalBasic = salaries.reduce((a, s) => a + s.basic, 0);
    const totalBonus = salaries.reduce((a, s) => a + s.bonus, 0);
    const totalDeductions = salaries.reduce((a, s) => a + s.deductions, 0);
    const totalNet = salaries.reduce((a, s) => a + s.netSalary, 0);

    res.json({ totalBasic, totalBonus, totalDeductions, totalNet, salaries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addOrUpdateSalary, getAllSalaries, getMySalaries, getMySalaryStats };
