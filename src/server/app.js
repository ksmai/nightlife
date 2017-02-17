'use strict';
const config      = require('../../config.json');
const compression = require('compression');
const express     = require('express');
const helmet      = require('helmet');
const mongoose    = require('mongoose');
const path        = require('path');

const ASSETS_PATH = path.join(__dirname, '../../assets');
const BIN_PATH    = path.join(__dirname, '../../bin');
const PORT        = process.env.PORT || config.PORT || 3000;
const DB_URL      = process.env.DB_URL || config.URL ||
  'mongodb://localhost/nightlife';

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.static(BIN_PATH));
app.use(express.static(ASSETS_PATH));
app.get('/*', displayHomepage);
app.use(errorHandler);

mongoose.Promise = global.Promise;
mongoose
  .connect(DB_URL)
  .then(startServer, dbError);

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

function displayHomepage(req, res, next) {
  res.sendFile('index.html', {
    root: BIN_PATH
  });
}

function errorHandler(err, req, res, next) {
  res.status(500).send('SERVER ERROR');
}