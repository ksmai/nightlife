'use strict';

module.exports = {
  isAuthenticated,
  isNotAuthenticated
};
////////////////////

function isAuthenticated(req, res, next) {
  if(!req.user) return next(new Error('UNAUTHENTICATED'));

  next();
}

function isNotAuthenticated(req, res, next) {
  if(req.user) return next(new Error('ALREADY AUTHENTICATED'));

  next();
}
