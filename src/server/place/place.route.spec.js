'use strict';
const Place      = require('../place/place.model');
const express    = require('express');
const httpStatus = require('http-status');
const mongoose   = require('mongoose');
const router     = require('./place.route');
const supertest  = require('supertest');

const DB_URL = 'mongodb://localhost/test';

describe('Place API', function() {
  let request;

  const testPlace = { _id: 'some test place' };

  const join = function join(decision) {
    const endpoint = decision
      ? 'join'
      : 'unjoin';

    return function(id, expect) {
      return request.
        post(`/${endpoint}/${id}`).
        expect(expect);
    };
  };

  beforeAll(function(done) {
    const app = express();
    app.use(router);
    request = supertest(app);

    return mongoose.
      connect(DB_URL).
      then(done, done.fail);
  });

  beforeEach(function(done) {
    return Place.
      remove({}).
      then(done, done.fail);
  });

  beforeEach(function(done) {
    return Place.
      create(testPlace).
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

  describe('for unauthenticated user', function() {
    it('cannot join the test place', function(done) {
      return join(true)(testPlace._id, httpStatus.UNAUTHORIZED).
        then(function(res) {
          expect(res.text).toMatch(/unauth\w+ed/i);
          done();
        }).
        catch(done.fail);
    });

    it('cannot unjoin the test place', function(done) {
      return join(false)(testPlace._id, httpStatus.UNAUTHORIZED).
        then(function(res) {
          expect(res.text).toMatch(/unauth\w+ed/i);
          done();
        }).
        catch(done.fail);
    });
  });

  describe('for an authenticated user', function() {
    beforeAll(function() {
      const app = express();
      app.use(function(req, res, next) {
        req.user = { _id: '111111111111111111111111' };
        next();
      });
      app.use(router);
      request = supertest(app);
    });

    it('can join the testPlace once', function(done) {
      return join(true)(testPlace._id, httpStatus.OK).
        then(done, done.fail);
    });

    it('can unjoin the testPlace after joining', function(done) {
      return join(true)(testPlace._id, httpStatus.OK).
        then(() => join(false)(testPlace._id, httpStatus.OK)).
        then(done, done.fail);
    });

    it('cannot unjoin the testPlace before joining', function(done) {
      return join(false)(testPlace._id, httpStatus.BAD_REQUEST).
        then(done, done.fail);
    });

    it('cannot join the same testPlace twice in a row', function(done) {
      return join(true)(testPlace._id, httpStatus.OK).
        then(() => join(true)(testPlace._id, httpStatus.BAD_REQUEST)).
        then(done, done.fail);
    });

    it('cannot unjoin the same testPlace twice in a row', function(done) {
      return join(true)(testPlace._id, httpStatus.OK).
        then(() => join(false)(testPlace._id, httpStatus.OK)).
        then(() => join(false)(testPlace._id, httpStatus.BAD_REQUEST)).
        then(done, done.fail);
    });

    it('cannot join an non-existent place', function(done) {
      return join(true)('non-existent id @$#%#^', httpStatus.BAD_REQUEST).
        then(done, done.fail);
    });

    it('cannot unjoin an non-existent place', function(done) {
      return join(false)('rvewvrwer$#%', httpStatus.BAD_REQUEST).
        then(done, done.fail);
    });
  });
});

