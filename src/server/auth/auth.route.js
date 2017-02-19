'use strict';
const express    = require('express');
const httpStatus = require('http-status');
const passport   = require('passport');

const router = express.Router();
const strategies = ['facebook', 'twitter'];
for(const strategy of strategies) {
  router.get(`/${strategy}`,
    ensureNotLogin,
    saveReferrer,
    passport.authenticate(strategy));

  router.get(`/${strategy}/return`,
    passport.authenticate(strategy, {
      failureRedirect: '/'
    }),
    returnToReferrer);
}

router.get('/me', ensureLogin, getMyInfo);
router.get('/logout', ensureLogin, logout);
router.use(authErrorHandler);

module.exports = router;
////////////////////

function saveReferrer(req, res, next) {
  req.session.referrer = req.get('Referrer') || '/';
  next();
}

function returnToReferrer(req, res) {
  res.redirect(req.session.referrer);
  delete req.session.referrer;
}

function authErrorHandler(err, req, res, next) {
  res.status(httpStatus.UNAUTHORIZED).send('UNAUTHORIZED');
}

function ensureNotLogin(req, res, next) {
  if(req.user) return next(new Error('UNAUTHORIZED'));

  return next();
}

function ensureLogin(req, res, next) {
  if(!req.user) return next(new Error('UNAUTHORIZED'));

  return next();
}

function logout(req, res) {
  req.logout();
  res.send('Successful Logout');
}

function getMyInfo(req, res) {
  res.json(req.user);
}
