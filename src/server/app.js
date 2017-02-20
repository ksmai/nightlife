'use strict';
const auth        = require('./auth/auth');
const config      = require('../../config.json');
const compression = require('compression');
const express     = require('express');
const helmet      = require('helmet');
const httpStatus  = require('http-status');
const mongoose    = require('mongoose');
const path        = require('path');
const yelpRouter  = require('./yelp/yelp.route');

const ASSETS_PATH = path.join(__dirname, '../../assets');
const API_MOUNT   = '/api/v1';
const AUTH_MOUNT  = '/auth';
const BIN_PATH    = path.join(__dirname, '../../bin');
const DEBUG_PORT  = 3000;
const PORT        = process.env.PORT || config.PORT || DEBUG_PORT;
const DB_URL      = process.env.DB_URL || config.URL ||
  'mongodb://localhost/nightlife';

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.static(BIN_PATH));
app.use(express.static(ASSETS_PATH));
auth(AUTH_MOUNT, app);
app.use(API_MOUNT, yelpRouter);
app.get('/*', displayHomepage);
app.use(errorHandler);

mongoose.Promise = global.Promise;
mongoose.
  connect(DB_URL).
  then(startServer, dbError);

function startServer() {
  app.listen(PORT, function() {
    console.log(`Server listening on PORT ${PORT}`);
    console.log(`DB_URL: ${DB_URL}`);
    console.log(`PID: ${process.pid}`);
  });
}

function dbError(err) {
  console.log(`Cannot connect to ${DB_URL}`);
  console.log(err);
  process.exit(1);
}

function displayHomepage(req, res) {
  res.sendFile('index.html', { root: BIN_PATH });
}

function errorHandler(err, req, res, next) {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send('SERVER ERROR');
}
