const express = require('express');
const router = express.Router();

const EmployeesController = require('../controllers/employees');

router.get('/', EmployeesController.get_ratings);

router.get('/rate', EmployeesController.get_employees);

router.get('/rate/:employeeId', EmployeesController.rate_employee);

router.post('/rate/:employeeId', EmployeesController.submit_rate_employee);

router.get('/profile', EmployeesController.edit_profile);

router.post('/profile', EmployeesController.submit_edit_profile);

module.exports = router;
