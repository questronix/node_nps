const express = require('express');
const router = express.Router();

const DepartmentsController = require('../controllers/departments');

router.get('/', DepartmentsController.get_all_employees);

router.get('/rate/:employeeId', DepartmentsController.rate_employee);

router.post('/rate/:employeeId', DepartmentsController.submit_rate_employee);

module.exports = router;
