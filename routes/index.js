'use strict';

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('pages/index');
    });

    app.get('/about', function(req, res) {
        res.render('pages/about');
    });
   app.get('/register',function(req,res){
       res.render('pages/register')
   });
   app.get('/login',function(req,res){
    res.render('pages/login')
   });
   app.get('/success',function(req,res){
    res.render('pages/success')
   });
   app.get('/error',function(req,res){
    res.render('pages/error')
   });
   app.get('/department',function(req,res){
    res.render('pages/department')
   });
   app.get('/ratings',function(req,res){
    res.render('pages/ratings')
   });
};