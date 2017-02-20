'use strict';
const config  = require('../../../config.json');
const crypto  = require('crypto');
const OAuth   = require('oauth-1.0a');
const request = require('request');

module.exports = ((function({oauth, token}) {
  return listBusiness.bind(this, oauth, token);
})(initOAuth()));
////////////////////

function initOAuth() {
  const auth = {};
  const keys = ['YELP_CONSUMER_KEY', 'YELP_CONSUMER_SECRET', 'YELP_TOKEN',
    'YELP_TOKEN_SECRET'];

  for(const key of keys) {
    auth[key] = process.env[key] || config[key];
    if(!auth[key]) throw new Error(`${key} not available`);
  }

  /* eslint camelcase: "off" */
  const oauth = OAuth({
    consumer: {
      key: auth.YELP_CONSUMER_KEY,
      secret: auth.YELP_CONSUMER_SECRET
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
      return crypto.
        createHmac('sha1', key).
        update(base_string).
        digest('base64');
    }
  });

  const token = {
    key: auth.YELP_TOKEN,
    secret: auth.YELP_TOKEN_SECRET
  };

  return { oauth, token };
}

function listBusiness(oauth, token, loc, term = 'food') {
  const requestData = {
    url: 'https://api.yelp.com/v2/search',
    method: 'GET',
    data: {}
  };

  requestData.url += `?term=${term}`;

  if(loc.lat && loc.lon) {
    requestData.url += `&ll=${loc.lat},${loc.lon}`;
  } else {
    requestData.url += `&location=${encodeURIComponent(loc)}`;
  }

  return new global.Promise(function(resolve, reject) {
    request({
      url: requestData.url,
      method: requestData.method,
      form: requestData.data,
      headers: oauth.toHeader(oauth.authorize(requestData, token))
    }, function(err, res, body) {
      if(err) return reject(err);

      resolve(JSON.parse(body));
    });
  });
}
