const express = require('express');
const router = express.Router();

const ClientsController = require('../controllers/clients');

router.get('/', ClientsController.get_ratings);

router.get('/rate', ClientsController.rate_employee);

router.post('/rate', ClientsController.submit_rate_employee);

router.get('/get_employees/:department_id', ClientsController.get_employees);

//
// router.get('/profile', ClientsController.edit_profile);
//
// router.post('/profile', ClientsController.submit_edit_profile);

module.exports = router;
