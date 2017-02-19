'use strict';
const passport    = require('passport');
const session     = require('express-session');
const User        = require('../user/user.model');
const facebook    = require('./facebook.strategy');
const twitter     = require('./twitter.strategy');
const authRouter  = require('./auth.route');

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
facebook(passport);
twitter(passport);

module.exports = setupApp;

////////////////////
function serializeUser(user, cb) {
  return cb(null, user._id);
}

function deserializeUser(id, cb) {
  return User.
    deserialize(id).
    then(function(doc) {
      return cb(null, doc);
    }).
    catch(cb);
}

function setupApp(mount, app) {
  app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(mount, authRouter);

  return app;
}
