'use strict';
const yelp = require('./yelp');

describe('Yelp API', function() {
  it('can search with a location string', function(done) {
    return yelp('Berkeley, CA').
      then(testYelpRes).
      then(done, done.fail);
  });

  it('can search with latitude/longitude', function(done) {
    return yelp({
      lat: '37.788022',
      lon: '-122.399797'
    }).
    then(testYelpRes).
    then(done, done.fail);
  });
});

function testYelpRes(res) {
  expect(res.businesses.length).toBeGreaterThan(0);
  expect(res.region).toBeDefined();

  const busi = res.businesses[0];
  const keys = ['id', 'name', 'image_url', 'url', 'display_phone',
    'review_count', 'rating', 'location'];
  for(const key of keys) {
    expect(busi[key]).toBeDefined();
  }
  return res;
}
