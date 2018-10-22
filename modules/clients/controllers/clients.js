const bcrypt = require('bcrypt');
const mysql = require('mysql');

exports.get_ratings = (req, res, next) => {
  if(req.session.user_type !== "clients") {
    res.redirect('/logout');
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'SELECT department, rating, CONCAT(e.last_name, ", ", e.first_name) as name FROM ratings r JOIN employees e ON r.employee_id=e.employee_id JOIN clients c ON r.rater_client=c.client_id AND r.rater_client!=0 JOIN departments d ON e.department_id=d.department_id WHERE r.rater_client=' + req.session.user_id + ';';

      var query = connection.query(sql, function(error, rows) {
        if(error) console.log(error);
        else {
          success = req.session.success;
          req.session.success = null;

          res.render('pages/clients/ratings', {
            title: 'Ratings',
            client_ratings: rows,
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
    var sql = 'SELECT * FROM departments ORDER BY department';

    var query = connection.query(sql, function(error, row) {
      if(error) res.status(500).json({error: error});

      if(row.length > 0) {
        errors = req.session.errors;
        req.session.errors = null;

        res.render('pages/clients/rate_employee', {
          title: 'Rate Employee',
          departments: row,
          errors: errors
        });
      } else {
        res.status(404).json({message: 'Client does not exist'});
      }
    });

    if(err) {
      res.status(500).json({error: err});
    }
  });
}

exports.get_employees = (req, res, next) => {
  if(req.session.user_type !== "clients") {
    return false;
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'SELECT employee_id, CONCAT(last_name, ", ", first_name) as name FROM employees WHERE department_id=' + req.params.department_id + ' AND employee_id NOT IN(SELECT employee_id FROM ratings WHERE rater_client=' + req.session.user_id + ');';

      var query = connection.query(sql, function(error, rows) {
        if(error) console.log(error);
        else {
          res.send(rows);
        }
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}

exports.submit_rate_employee = (req, res, next) => {
  // validate
  req.check('employee_department', 'Employee Department is required').exists({checkFalsy: true});
  req.check('employee_name', 'Employee Name is required').exists({checkFalsy: true});
  req.check('rate', 'Rating is required').exists({checkFalsy: true});

  var errors = req.validationErrors();
  if(errors) {
    req.session.errors = errors;
    res.redirect('../clients/rate/');
  } else {
    req.getConnection(function(err, connection) {
      var sql = 'INSERT INTO ratings(employee_id, rater_client, rating) VALUES(' + req.body.employee_name + ',' + req.session.user_id + ', ' + req.body.rate + ');';

      var query = connection.query(sql, function(error, row) {
        if(error) res.status(500).json({error: error});
        else {
          // redirect
          req.session.success = 'Employee rated successfully';
          res.redirect('/clients');
        }
      });

      if(err) {
        res.status(500).json({error: err});
      }
    });
  }
}
