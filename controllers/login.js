const bcrypt = require('bcrypt');
const mysql = require('mysql');

exports.login = (req, res, next) => {
  if(req.session.employee_id) {
    res.redirect('/dashboard');
  } else {
    errors = req.session.errors;
    req.session.errors = null;

    res.render('pages/login', {
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

  var errors = req.validationErrors();
  if(errors) {
    req.session.errors = errors;
    res.redirect('/');
  } else {
    req.getConnection(function(err, connection) {
      var email = '"' + req.body.email + '"';
      var sql = 'SELECT * FROM employees WHERE email = ' + email + ';';

      var query = connection.query(sql, function(error, row) {
        if(error) res.status(500).json({error: error});

        if(row.length === 1) {
          bcrypt.compare(req.body.password, row[0].password, (err, result) => {
            if(err) {
              return res.status(401).json({message: 'Authentication failed'});
            }
            if(result) {
              // set session data
              req.session.employee_id = row[0].employee_id;
              req.session.email = email;

              res.redirect('/dashboard');
            } else {
              return res.status(401).json({message: 'Authentication failed'});
            }
          });
        } else {
          return res.status(401).json({message: 'Authentication failed'});
        }
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.registration = (req, res, next) => {
  errors = req.session.errors;
  req.session.errors = null;

  res.render('pages/register', {
    title: 'Employee Registration',
    errors: errors
  });
}

exports.submit_registration = (req, res, next) => {
  // form validation
  req.check('email', 'Invalid email address').isEmail();
  req.check('confirm_password', 'Confirm Password does not match Password field').equals(req.body.password);
  req.check('first_name', 'First Name is required').exists({checkFalsy: true});
  req.check('last_name', 'Last Name is required').exists({checkFalsy: true});
  req.check('email', 'Email address is required').exists({checkFalsy: true});
  req.check('password', 'Password is required').exists({checkFalsy: true});

  var errors = req.validationErrors();
  if(errors) {
    req.session.errors = errors;
    res.redirect('/registration');
  } else {
    req.getConnection(function(err, connection) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) {
          return res.status(500).json({error: err});
        } else {
          var first_name = req.body.first_name;
          var last_name = req.body.last_name;
          var email = req.body.email;
          var password = hash;

          var values = '"' + first_name + '", ' +
                      '"' + last_name + '", ' +
                      '"' + email + '", ' +
                      '"' + password + '"';

          sql = 'INSERT INTO employees(first_name, last_name, email, password) VALUES(' + values + ');';

          var query = connection.query(sql, function(error, row) {
            if(error) res.status(500).json({error: error});
            else {
              // redirect
              res.redirect('/');
            }
          });
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
