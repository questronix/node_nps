const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/login');

router.get('/registration', LoginController.registration);

router.post('/registration', LoginController.submit_registration);

router.get('/', LoginController.login);

router.post('/', LoginController.submit_login);

router.get('/logout', LoginController.logout);

module.exports = router;
