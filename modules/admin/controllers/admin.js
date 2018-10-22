const bcrypt = require('bcrypt');
const mysql = require('mysql');

exports.get_home = (req, res) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    res.render('pages/admin/index');
  }
}

exports.get_all_departments = (req, res, next) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'SELECT * FROM departments ORDER BY department';

      var query = connection.query(sql, function(err, rows) {
        res.render('pages/admin/departments', {
          title: 'Departments',
          departments: rows
        });
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.get_department_employees = (req, res, next) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'SELECT * FROM employees WHERE department_id=' + req.params.department_id;

      var query = connection.query(sql, function(err, rows) {
        success = req.session.success;
        req.session.success = null;

        res.render('pages/admin/employees_list', {
          title: 'Employees',
          employees: rows,
          department_id: req.params.department_id,
          success: success
        });
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.add_department_employee = (req, res, next) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'SELECT department FROM departments WHERE department_id=' + req.params.department_id;

      var query = connection.query(sql, function(err, row) {
        errors = req.session.errors;
        req.session.errors = null;

        res.render('pages/admin/add_employee', {
          title: 'Employees',
          department: row,
          department_id: req.params.department_id,
          errors: errors
        });
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.submit_add_department_employee = (req, res, next) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    // form validation
    req.check('email', 'Invalid email address').isEmail();
    req.check('first_name', 'First Name is required').exists({checkFalsy: true});
    req.check('last_name', 'Last Name is required').exists({checkFalsy: true});
    req.check('email', 'Email address is required').exists({checkFalsy: true});
    req.check('password', 'Password is required').exists({checkFalsy: true});
    req.check('address', 'Address is required').exists({checkFalsy: true});
    req.check('mobile', 'Mobile is required').exists({checkFalsy: true});
    req.check('designation', 'Designation is required').exists({checkFalsy: true});

    var errors = req.validationErrors();
    if(errors) {console.log(errors);
      req.session.errors = errors;
      res.redirect('/admin/departments/add/' + req.params.department_id);
    } else {
      req.getConnection(function(err, connection) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if(err) {
            return res.status(500).json({error: err});
          } else {
            var first_name = req.body.first_name;
            var middle_name = req.body.middle_name;
            var last_name = req.body.last_name;
            var email = req.body.email;
            var address = req.body.address;
            var mobile = req.body.mobile;
            var phone = req.body.phone;
            var password = hash;
            var designation = req.body.designation;
            var department_id = req.params.department_id;
            // var profile_picture = '"' + req.body.profile_picture + '"';

            var values = '"' + first_name + '", ' +
                        '"' + middle_name + '", ' +
                        '"' + last_name + '", ' +
                        '"' + email + '", ' +
                        '"' + address + '", ' +
                        '"' + mobile + '", ' +
                        '"' + phone + '", ' +
                        '"' + password + '", ' +
                        '"' + designation + '", ' +
                        '"' + department_id + '"';

            sql = 'INSERT INTO employees(first_name, middle_name, last_name, email, address, mobile, phone, password, designation, department_id) VALUES(' + values + ');';

            var query = connection.query(sql, function(error, row) {
              if(error) res.status(500).json({error: error});
              else {
                req.session.success = 'Employee added successfully';
                // redirect
                res.redirect('/admin/departments/view/' + req.params.department_id);
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
}

exports.get_all_clients = (req, res, next) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'SELECT * FROM clients';

      var query = connection.query(sql, function(err, rows) {
        success = req.session.success;
        req.session.success = null;

        res.render('pages/admin/clients_list', {
          title: 'Clients',
          clients: rows,
          success: success
        });
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.add_client = (req, res, next) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      errors = req.session.errors;
      req.session.errors = null;

      res.render('pages/admin/add_client', {
        title: 'Clients',
        errors: errors
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.submit_add_client = (req, res, next) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    // form validation
    req.check('email', 'Invalid email address').isEmail();
    req.check('name', 'Name is required').exists({checkFalsy: true});
    req.check('email', 'Email address is required').exists({checkFalsy: true});
    req.check('address', 'Address is required').exists({checkFalsy: true});
    req.check('mobile', 'Mobile is required').exists({checkFalsy: true});
    req.check('project', 'Project is required').exists({checkFalsy: true});

    var errors = req.validationErrors();
    if(errors) {console.log(errors);
      req.session.errors = errors;
      res.redirect('/admin/clients/add/');
    } else {
      req.getConnection(function(err, connection) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if(err) {
            return res.status(500).json({error: err});
          } else {
            var name = req.body.name;
            var email = req.body.email;
            var address = req.body.address;
            var mobile = req.body.mobile;
            var project = req.body.project;
            var password = hash;

            var values = '"' + name + '", ' +
                        '"' + email + '", ' +
                        '"' + address + '", ' +
                        '"' + mobile + '", ' +
                        '"' + password + '", ' +
                        '"' + project + '"';

            sql = 'INSERT INTO clients(name, email, address, mobile, password, project) VALUES(' + values + ');';

            var query = connection.query(sql, function(error, row) {
              if(error) res.status(500).json({error: error});
              else {
                req.session.success = 'Client added successfully';
                // redirect
                res.redirect('/admin/clients');
              }
            });

            if(err) {
              res.status(500).json({error: err});
            }

          }
        });
      });
    }
  }
}

exports.get_all_users = (req, res, next) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'SELECT * FROM admin';

      var query = connection.query(sql, function(err, rows) {
        success = req.session.success;
        req.session.success = null;

        res.render('pages/admin/users_list', {
          title: 'Clients',
          users: rows,
          success: success
        });
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.add_user = (req, res, next) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      errors = req.session.errors;
      req.session.errors = null;

      res.render('pages/admin/add_user', {
        title: 'Clients',
        errors: errors
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.submit_add_user = (req, res, next) => {
  if(req.session.user_type !== "admin") {
    res.redirect('/logout');
  } else {
    // form validation
    req.check('email', 'Invalid email address').isEmail();
    req.check('email', 'Email address is required').exists({checkFalsy: true});

    var errors = req.validationErrors();
    if(errors) {console.log(errors);
      req.session.errors = errors;
      res.redirect('/admin/users/add/');
    } else {
      req.getConnection(function(err, connection) {
        var email = req.body.email;

        sql = 'INSERT INTO admin(email) VALUES("' + email + '");';

        var query = connection.query(sql, function(error, row) {
          if(error) res.status(500).json({error: error});
          else {
            req.session.success = 'User added successfully';
            // redirect
            res.redirect('/admin/users');
          }
        });

        if(err) {
          res.status(500).json({error: err});
        }
      });
    }
  }
}
