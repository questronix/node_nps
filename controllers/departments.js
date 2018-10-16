const bcrypt = require('bcrypt');
const mysql = require('mysql');

exports.get_all_employees = (req, res, next) => {
  if(!req.session.employee_id) {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'SELECT *, d.department FROM employees e JOIN departments d ON e.department_id=d.department_id';

      var query = connection.query(sql, function(err, rows) {
        res.render('pages/department', {
          title: 'Employees',
          employees: rows
        });
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.rate_employee = (req, res, next) => {
  req.getConnection(function(err, connection) {
    var sql = 'SELECT * FROM employees WHERE employee_id = ' + req.params.employeeId;

    var query = connection.query(sql, function(error, row) {
      if(error) res.status(500).json({error: error});

      if(row.length > 0) {
        errors = req.session.errors;
        req.session.errors = null;

        res.render('pages/rate_employee', {
          title: 'Rate Employee',
          employee: row,
          errors: error
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
      var sql = 'INSERT INTO ratings(employee_id, rater_employee, rating) VALUES(' + req.params.employeeId + ',' + req.session.employee_id + ', ' + req.body.rate + ');';

      var query = connection.query(sql, function(error, row) {
        if(error) res.status(500).json({error: error});
        else {
          // redirect
          res.redirect('/departments');
        }
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}
