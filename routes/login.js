const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/login');

// app.get('/', function(req, res) {
//     res.render('pages/index');
// });
//
// app.get('/about', function(req, res) {
//     res.render('pages/about');
// });
// app.get('/register',function(req,res){
//    res.render('pages/register')
// });
// app.get('/login',function(req,res){
// res.render('pages/login')
// });

router.get('/registration', LoginController.registration);

router.post('/registration', LoginController.submit_registration);

router.get('/', LoginController.login);

router.post('/', LoginController.submit_login);

router.get('/logout', LoginController.logout);

module.exports = router;
