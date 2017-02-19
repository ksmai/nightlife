'use strict';
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../user/user.model');
const config = require('./../../../config.json');

const FACEBOOK_APP_ID = config.FACEBOOK_APP_ID ||
  process.env.FACEBOOK_APP_ID;

const FACEBOOK_APP_SECRET = config.FACEBOOK_APP_SECRET ||
  process.env.FACEBOOK_APP_SECRET;

module.exports = function(passport) {
  return passport.
    use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/return'
    }, function(accessToken, refreshToken, profile, cb) {
      return User.
        signin({
          socialMediaId: profile.id,
          account: profile.provider,
          picture: `https://graph.facebook.com/v2.8/${profile.id}/picture?type=large`,
          name: profile.displayName || profile.username
        }).
        then(function(doc) {
          return cb(null, doc);
        }).
        catch(cb);
    }));
};
