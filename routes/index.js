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
};