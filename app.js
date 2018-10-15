// ================================================================
// get all the tools we need
// ================================================================
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const expressSession = require('express-session');
const expressValidator = require('express-validator');
const path = require('path');
const connection = require('express-myconnection');

const app = express();

require('dotenv').config();

// ================================================================
// log errors
// ================================================================
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at: ', reason.stack || reason);
});

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(expressValidator());

// ================================================================
// setup MySQL connection
// ================================================================
const options = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
};

app.use(connection(mysql, options, 'single'));

const MySQLStore = require('express-mysql-session')(expressSession);
const sessionStore = new MySQLStore(options);

app.use(expressSession({
  key: process.env.SESSION_COOKIE_NAME,
  secret: process.env.SESSION_COOKIE_SECRET,
  store: sessionStore,
  saveUninitialized: false,
  resave: false
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// ================================================================
// setup our express application
// ================================================================
// app.use('/public', express.static(process.cwd() + '/public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// ================================================================
// setup routes
// ================================================================
// const routes = require('./routes/index.js');
// routes(app);
const loginRoutes = require('./routes/login');
const employeeRoutes = require('./routes/employees');

app.use('/', loginRoutes);
app.use('/employees', employeeRoutes);

// ================================================================
// log errors
// ================================================================
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
