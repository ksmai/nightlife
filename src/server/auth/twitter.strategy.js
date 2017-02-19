'use strict';
const User = require('../user/user.model');
const TwitterStrategy = require('passport-twitter').Strategy;
const config = require('../../../config.json');

const TWITTER_CONSUMER_KEY = config.TWITTER_CONSUMER_KEY ||
  process.env.TWITTER_CONSUMER_KEY;

const TWITTER_CONSUMER_SECRET = config.TWITTER_CONSUMER_SECRET ||
  process.env.TWITTER_CONSUMER_SECRET;

module.exports = function(passport) {
  return passport.
    use(new TwitterStrategy({
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: '/auth/twitter/return'
    }, function(token, tokenSecret, profile, cb) {
      return User.
        signin({
          account: profile.provider,
          name: profile.displayName || profile.username,
          picture: profile.photos[0].value,
          socialMediaId: profile.id
        }).
        then(function(doc) {
          return cb(null, doc);
        }).
        catch(cb);
    }));
};
