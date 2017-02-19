'use strict';
const yelp = require('./yelp');

describe('Yelp API', function() {
  it('can search with a location string', function(done) {
    return yelp('Berkeley, CA').
      then(function(res) {
        expect(0).toBe(0); // TODO
        done();
      }).
      catch(done.fail);
  });

  it('can search with latitude/longitude', function(done) {
    return yelp({
      lat: '37.788022',
      lon: '-122.399797'
    }).
    then(function(res) {
      expect(0).toBe(0); // TODO
      done();
    }).
    catch(done.fail);
  });
});
