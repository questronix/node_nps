const bcrypt = require('bcrypt');
const mysql = require('mysql');

exports.login = (req, res, next) => {
  if(req.session.user_type) {
    res.redirect(req.session.user_type + '/');
  } else {
    errors = req.session.errors;
    req.session.errors = null;

    res.render('pages/login/login', {
      title: 'Employee Login',
      errors: errors
    });
  }
}

exports.submit_login = (req, res, next) => {
  // form validation
  req.check('email', 'Email address is required').exists({checkFalsy: true});
  req.check('email', 'Invalid email address').isEmail();
  req.check('password', 'Password is required').exists({checkFalsy: true});
  req.check('user_type', 'User Type is required').exists({checkFalsy: true});

  var errors = req.validationErrors();
  if(errors) {
    req.session.errors = errors;
    res.redirect('/');
  } else {
    req.getConnection(function(err, connection) {
      var user_type = req.body.user_type;
      var email = '"' + req.body.email + '"';
      var sql = 'SELECT * FROM ' + user_type + ' WHERE email = ' + email + ';';

      var query = connection.query(sql, function(error, row) {
        if(error) res.status(500).json({error: error});

        if(row.length === 1) {
          bcrypt.compare(req.body.password, row[0].password, (err, result) => {
            if(err) {
              req.session.errors = 'Authentication failed'
              res.redirect('/');
            }
            if(result) {
              // set session data
              if(user_type == "admin") {
                req.session.user_id = row[0].admin_id;
              } else if(user_type == "employees") {
                req.session.user_id = row[0].employee_id;
                req.session.department_id = row[0].department_id;
              } else if(user_type == "clients") {
                req.session.user_id = row[0].client_id;
              }

              req.session.email = email;
              req.session.user_type = user_type;

              res.redirect(user_type + '/');
            } else {
              req.session.errors = 'Authentication failed'
              res.redirect('/');
            }
          });
        } else {
          req.session.errors = 'Authentication failed'
          res.redirect('/');
        }
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
}
