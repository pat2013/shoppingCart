"use strict";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var products = require('./routes/products');
var validator = require('express-validator');
var mongoose = require('mongoose');
var csrf = require('csurf');
var MongoStore = require('connect-mongo')(session);
//mongo DB setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds127801.mlab.com:27801/mongoose-thumbnail-example');
require('./config/passport');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser('mybadasssecret'));
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 60000 * 12 }
})); // 12mins
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// //postponed session expiration 
// app.all('/*', function(req, res, next) {
//     if ('HEAD' === req.method || 'OPTIONS' === req.method) return next();
//     req.session._garbage = new Date()
//     req.session.touch()
//     next();
// });

// //prevent Cross-site request forgery attack setting
// app.use(csrf());
// app.use(function(req, res, next) {
//     console.log('prevent csrf attack', req.csrfToken());
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     return next();
// });

app.use('/users', users);
app.use('/products', products);
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;