var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var webpackDevHelper = require('./hotReload.js');
var utils = require('./utils/utils');


// Require routes.
var users = require('./routes/users');
var rankings = require('./routes/rankings');
var lists = require('./routes/lists');

// Require Users model for authentication.
var User = require('./models/Users');
var Users = User.Users;


var Ranking = require('./models/Ranking');
/** Set up MongoDB **/
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mymongodb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();

// Set up webpack-hot-middleware for development, express-static for production
if (process.env.NODE_ENV !== 'production'){
  console.log("DEVELOPMENT: Turning on WebPack middleware...");
  app = webpackDevHelper.useWebpackMiddleware(app);
  app.use('/css', express.static(path.join(__dirname, 'public/css')));
} else {
  console.log("PRODUCTION: Serving static files from /public...");
  app.use(express.static(path.join(__dirname, 'public')));
}

// Set up some middleware to use.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret : '6170', resave : true, saveUninitialized : true }));
app.use(csrfProtection);

/**
 * CSURF Middleware
 */
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  // handle CSRF token errors here
  console.log(err);
  utils.sendErrorResponse(res, 403, "Bad CSRF Token");
});

/**
 * CSURF Middleware
 */
app.use(function (req, res, next) {
  var token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token;
  next();
});

// Authentication middleware. This function
// is called on _every_ request and populates
// the req.currentUser field with the logged-in
// user object based off the username provided
// in the session variable (accessed by the
// encrypted cookied).
// Same as example notes app. Many thanks and appreciates.
app.use(function(req, res, next) {
  if (req.session.user) {
    Users.findUser(req.session.user.username, function(err, user) {
      if (user) {
        req.currentUser = user;
      } else {
        req.session.destroy();
      }
      next();
    });
  } else {
    next();
  }
});

// Set up our routes.
app.use('/api/users', users);
app.use('/api/rankings', rankings);
app.use('/api/lists', lists);
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/index.html'))
});


app.listen((process.env.PORT || 3000), function() {
  console.log("Listening for port");
});


// Export our app (so that tests and bin can find it)
module.exports = app;
