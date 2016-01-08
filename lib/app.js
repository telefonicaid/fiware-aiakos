/*
 * Copyright 2015 Telefónica I+D
 * All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
'use strict';

var express = require('express');
var path = require('path');
var logger = require('./logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'),
    cuid = require('cuid');

var index = require('./routes/index');
var v1 = require('./routes/v1');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var domainMiddleware = require('express-domain-middleware');
app.use(domainMiddleware);
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {

  req.domain.context = {
        trans: cuid(),
        op: req.method + req.path
  };
  next();
});

app.use('/', index);
app.use('/v1', v1);

// catch 404 and forward to error handler
app.use(function(req, res) {
  var err = new Error('Path not found');
  err.status = 404;
  logger.warn(err);
  err.stack = '';
  res.status(err.status);
    res.render('error', {
      message: err.message,
      error: err
    });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/** @export */
module.exports = app;
