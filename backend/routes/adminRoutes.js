const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getAllEmployees,
  getEmployeeById,
  updateEmployeeStatus,
  deleteEmployee,
  getAdminStats,
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id/status', updateEmployeeStatus);
router.delete('/employees/:id', deleteEmployee);

module.exports = router;
