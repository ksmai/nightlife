'use strict';
const supertest = require('supertest');
const express = require('express');
const initAuth = require('./auth');
const httpStatus = require('http-status');

describe('auth module', function() {
  let app, request;

  describe('for unauthenticated user', function() {
    beforeAll(function() {
      app = express();
      initAuth('/', app);
      request = supertest(app);
    });

    it('can login with facebook and be redirectd', function(done) {
      return request.
        get('/facebook').
        expect(httpStatus.FOUND).
        expect('location', /^https?:\/\/.*facebook\.com\/.+/i).
        then(done, done.fail);
    });

    it('can login with twitter and be redirectd', function(done) {
      return request.
        get('/twitter').
        expect(httpStatus.FOUND).
        expect('location', /^https?:\/\/.*twitter\.com\/.+/i).
        then(done, done.fail);
    });

    it('cannot logout without logging in', function(done) {
      return request.
        get('/logout').
        expect(httpStatus.UNAUTHORIZED).
        then(done, done.fail);
    });

    it('cannot get current user info', function(done) {
      return request.
        get('/me').
        expect(httpStatus.UNAUTHORIZED).
        then(done, done.fail);
    });
  });

  describe('for authenticated user', function() {
    const testUser = {
      _id: 123,
      name: 'Peter Moe',
      picture: 'mypic.jpg',
      account: 'facebook',
      socialMediaId: 456
    };

    const logout = jasmine.createSpy('logout');

    beforeAll(function() {
      app = express();
      app.use(function(req, res, next) {
        req.user = testUser;
        req.logout = logout;
        next();
      });
      initAuth('/', app);
      request = supertest(app);
    });

    it('cannot login again using facebook', function(done) {
      return request.
        get('/facebook').
        expect(httpStatus.UNAUTHORIZED).
        then(done, done.fail);
    });

    it('cannot login again using twitter', function(done) {
      return request.
        get('/twitter').
        expect(httpStatus.UNAUTHORIZED).
        then(done, done.fail);
    });

    it('can logout', function(done) {
      expect(logout).not.toHaveBeenCalled();

      return request.
        get('/logout').
        expect(httpStatus.FOUND).
        then(function() {
          expect(logout).toHaveBeenCalledTimes(1);
          done();
        }).
        catch(done.fail);
    });

    it('can get info of herself', function(done) {
      return request.
        get('/me').
        expect('Content-Type', /json/).
        expect(httpStatus.OK, testUser).
        then(done, done.fail);
    });
  });
});
