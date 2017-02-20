'use strict';
const core = require('../core/core');
const express = require('express');
const httpStatus = require('http-status');
const Place = require('./place.model');

const router = express.Router();

router.post('/join/:id', core.isAuthenticated, participate('join'));
router.post('/unjoin/:id', core.isAuthenticated, participate('unjoin'));
router.use(errorHandler);

module.exports = router;
////////////////////

function participate(decision) {
  if(decision !== 'join' && decision !== 'unjoin') {
    throw new Error('Unknown decision for participate');
  }

  return function join(req, res, next) {
    return Place[decision]({
      placeId: req.params.id,
      userId: req.user._id
    }).
    then(function() {
      res.status(httpStatus.OK).send(`Successfully ${decision}ed`);
    }).
    catch(function() {
      next(new Error('BAD REQUEST'));
    });
  };
}

function errorHandler(err, req, res, next) {
  const msg = err.toString();
  const status = (/auth/i).test(msg)
    ? httpStatus.UNAUTHORIZED
    : httpStatus.BAD_REQUEST;

  res.status(status).send(msg);
}
