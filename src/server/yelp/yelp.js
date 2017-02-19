'use strict';
const config = require('../../../config.json');
// const http = require('http');

const auth = {};
const keys = ['YELP_CONSUMER_KEY', 'YELP_CONSUMER_SECRET', 'YELP_TOKEN',
  'YELP_TOKEN_SECRET'];

for(const key of keys) {
  auth[key] = process.env[key] || config[key];
  if(!auth[key]) throw new Error(`${key} not available`);
}

module.exports = function listBusiness(loc, term = 'food') {
  let url = `https://api.yelp.com/v2/search?term=${encodeURIComponent(term)}`;
  if(loc.lat && loc.lon) {
    url += `&ll=${loc.lat},${loc.lon}`;
  } else {
    url += `&location=${encodeURIComponent(loc)}`;
  }
  url += `oauth_consumer_key="${auth.YELP_CONSUMER_KEY}"`;
  url += `oauth_token="${auth.YELP_TOKEN}"`;
  url += 'oauth_signature_method="HMAC-SHA1"';
  url += `oauth_signature="${''}"`; // TODO
  url += `oauth_timestamp="${''}"`; // TODO
  url += `oauth_nonce="${''}"`; // TODO

  return global.Promise.resolve(url); // TODO
};
