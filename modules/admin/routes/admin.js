const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin');

router.get('/', AdminController.get_home);

router.get('/departments', AdminController.get_all_departments);

router.get('/departments/view/:department_id', AdminController.get_department_employees);

router.get('/departments/add/:department_id', AdminController.add_department_employee);

router.post('/departments/add/:department_id', AdminController.submit_add_department_employee);

router.get('/clients', AdminController.get_all_clients);

router.get('/clients/add', AdminController.add_client);

router.post('/clients/add', AdminController.submit_add_client);

router.get('/users', AdminController.get_all_users);

router.get('/users/add', AdminController.add_user);

router.post('/users/add', AdminController.submit_add_user);

module.exports = router;
