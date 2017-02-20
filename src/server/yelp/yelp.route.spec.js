'use strict';
const express    = require('express');
const httpStatus = require('http-status');
const mongoose   = require('mongoose');
const supertest  = require('supertest');
const yelpRouter = require('./yelp.route');

const DB_URL = 'mongodb://localhost/test';

describe('Yelp API route', function() {
  let request;

  beforeAll(function(done) {
    const app = express();
    app.use(yelpRouter);
    request = supertest(app);

    return mongoose.
      connect(DB_URL).
      then(done, done.fail);
  });

  afterAll(function(done) {
    const timeout = 500;
    const DISCONNECTED = 0;

    return mongoose.
      disconnect().
      then(function wait() {
        if(mongoose.connection.readyState === DISCONNECTED) return done();

        return new global.Promise(function(resolve, reject) {
          setTimeout(resolve, timeout);
        }).then(wait);
      }).
      catch(done.fail);
  });

  it('take a loc parameter', function(done) {
    return request.
      get('/business?loc=london').
      expect(httpStatus.OK).
      expect('Content-Type', /json/).
      then(function(res) {
        expect(res.body.businesses.length).toBeGreaterThan(0);
        expect(res.body.region).toBeDefined();
        done();
      }).
      catch(done.fail);
  });

  it('takes a ll (lat/lon) parameter', function(done) {
    return request.
      get('/business?ll=48.8589507,2.2775172').
      expect(httpStatus.OK).
      expect('Content-Type', /json/).
      then(function(res) {
        expect(res.body.businesses.length).toBeGreaterThan(0);
        expect(res.body.region).toBeDefined();
        done();
      }).
      catch(done.fail);
  });

  it('returns 400 for missing parameters', function(done) {
    return request.
      get('/business?abc=123').
      expect(httpStatus.BAD_REQUEST).
      then(function(res) {
        expect(res.text).toMatch(/missing/i);
        done();
      }).
      catch(done.fail);
  });

  it('returns 400 for invalid lat/lon', function(done) {
    return request.
      get('/business?ll=123.,123.0').
      expect(httpStatus.BAD_REQUEST).
      then(function(res) {
        expect(res.text).toMatch(/bad.*parameter/i);
        done();
      }).
      catch(done.fail);
  });
});
