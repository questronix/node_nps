const bcrypt = require('bcrypt');
const mysql = require('mysql');

exports.get_ratings = (req, res, next) => {
  if(req.session.user_type !== "employees") {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      var client_sql = 'SELECT r.rating, c.project, c.name as client_name FROM ratings r JOIN clients c ON r.rater_client=c.client_id AND r.rater_client!=0 WHERE r.employee_id=' + req.session.user_id;

      var employee_sql = 'SELECT r.rating, d.department, CONCAT(e.first_name, " ", e.last_name) as employee_name FROM ratings r LEFT JOIN employees e ON r.rater_employee=e.employee_id AND r.rater_employee!= 0 JOIN departments d ON e.department_id=d.department_id WHERE r.employee_id=' + req.session.user_id;

      var query = connection.query(client_sql, function(error, client_rows) {
        if(error) console.log(error);
        else {
          var query = connection.query(employee_sql, function(error, employee_rows) {
            if(error) console.log(error);
            else {
              success = req.session.success;
              req.session.success = null;

              res.render('pages/employees/ratings', {
                title: 'Ratings',
                client_ratings: client_rows,
                employee_ratings: employee_rows,
                success: success
              });
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

exports.get_employees = (req, res, next) => {
  if(req.session.user_type !== "employees") {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'SELECT e.*, r.rating, d.department FROM employees e JOIN departments d ON e.department_id=d.department_id LEFT JOIN ratings r ON e.employee_id=r.employee_id AND rater_employee=' + req.session.user_id + ' WHERE e.employee_id!=' + req.session.user_id + ';';

      var query = connection.query(sql, function(error, rows) {
        if(error) console.log(error);
        else {
          success = req.session.success;
          req.session.success = null;

          res.render('pages/employees/employees_list', {
            title: 'Employees',
            employees: rows,
            success: success
          });
        }
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.rate_employee = (req, res, next) => {
  req.getConnection(function(err, connection) {
    var sql = 'SELECT *, d.department FROM employees e JOIN departments d ON e.department_id=d.department_id WHERE employee_id = ' + req.params.employeeId;

    var query = connection.query(sql, function(error, row) {
      if(error) res.status(500).json({error: error});

      if(row.length > 0) {
        errors = req.session.errors;
        req.session.errors = null;

        res.render('pages/employees/rate_employee', {
          title: 'Rate Employee',
          employee: row,
          errors: errors
        });
      } else {
        res.status(404).json({message: 'Employee does not exist'});
      }
    });

    if(err) {
      res.status(500).json({error: err});
    }
  });
}

exports.submit_rate_employee = (req, res, next) => {
  // validate
  req.check('rate', 'Rating is required').exists({checkFalsy: true});

  var errors = req.validationErrors();
  if(errors) {
    req.session.errors = errors;
    res.redirect('../rate/' + req.params.employeeId);
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'INSERT INTO ratings(employee_id, rater_employee, rating) VALUES(' + req.params.employeeId + ',' + req.session.user_id + ', ' + req.body.rate + ');';

      var query = connection.query(sql, function(error, row) {
        if(error) res.status(500).json({error: error});
        else {
          // redirect
          req.session.success = 'Employee rated successfully';
          res.redirect('/employees/rate');
        }
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.edit_profile = (req, res, next) => {
  if(!req.session.user_id) {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'SELECT * FROM employees WHERE employee_id = ' + req.session.user_id;

      var query = connection.query(sql, function(error, row) {
        if(error) res.status(500).json({error: error});

        if(row.length > 0) {
          var departments = 'SELECT * FROM departments ORDER BY department;';

          var department_query = connection.query(departments, function(department_errors, departments) {
            if(department_errors) res.status(500).json({error: department_errors});

            errors = req.session.errors;
            req.session.errors = null;

            res.render('pages/employees/edit_profile', {
              title: 'Edit Profile',
              employee: row,
              departments: departments,
              errors: errors
            });
          });
        } else {
          res.status(404).json({message: 'Employee does not exist'});
        }
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });


  }
}

exports.submit_edit_profile = (req, res, next) => {
  // validate
  req.check('email', 'Invalid email address').isEmail();
  req.check('first_name', 'First Name is required').exists({checkFalsy: true});
  req.check('last_name', 'Last Name is required').exists({checkFalsy: true});
  req.check('email', 'Email address is required').exists({checkFalsy: true});

  var errors = req.validationErrors();
  if(errors) {
    req.session.errors = errors;
    res.redirect('/employees/profile');
  } else {
    req.getConnection(function(err, connection) {
      var first_name = req.body.first_name;
      var middle_name = req.body.middle_name;
      var last_name = req.body.last_name;
      var email = req.body.email;
      var address = req.body.address;
      var mobile = req.body.mobile;
      var phone = req.body.phone;
      var designation = req.body.designation;
      var department = req.body.department;
      // var profile_picture = '"' + req.body.profile_picture + '"';

      var sql = 'UPDATE employees SET first_name="' + first_name + '", middle_name="' + middle_name + '", last_name="' + last_name + '", email="' +  email + '", address="' + address + '", mobile="' + mobile + '", phone="' + phone + '", designation="' + designation + '", department_id="' + department + '" WHERE employee_id="' + req.session.user_id + '";';

      var query = connection.query(sql, function(error, row) {
        if(error) res.status(500).json({error: error});
        else {
          // redirect
          req.session.success = 'Profile edited successfully';
          res.redirect('/employees');
        }
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}
