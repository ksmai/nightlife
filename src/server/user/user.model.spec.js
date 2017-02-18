'use strict';
const mongoose = require('mongoose');
const User = require('./user.model');

const DB_URL = 'mongodb://localhost/test';
mongoose.Promise = global.Promise;

describe('User model', function() {
  const validUser = {
    name: 'John Doe',
    account: 'facebook',
    picture: 'https://some.domain.com/some/picture.jpg',
    socialMediaId: 123
  };

  let testUser;

  beforeAll(function(done) {
    const CONNECTED = 1;
    if(mongoose.connection.readyState === CONNECTED) return done();

    return mongoose.
      connect(DB_URL).
      then(done, done.fail);
  });

  afterAll(function(done) {
    const DISCONNECTED = 0;

    return mongoose.
      disconnect().
      then(function wait() {
        if(mongoose.connection.readyState === DISCONNECTED) return done();

        return new global.Promise(function(resolve, reject) {
          const timeout = 500;
          setTimeout(resolve, timeout);
        }).then(wait);
      }).
      catch(done.fail);
  });

  beforeEach(function(done) {
    testUser = Object.assign({}, validUser);
    return User.
      remove({}).
      then(done, done.fail);
  });

  it('should create a new document with valid user', function(done) {
    return User.
      create(testUser).
      then(function() {
        return User.findOne(testUser).exec();
      }).
      then(function(docs) {
        expect(docs).toEqual(jasmine.objectContaining(testUser));
        return done();
      }).
      catch(done.fail);
  });

  it('should reject user without a name', function(done) {
    testUser.name = '       ';
    return User.
      create(testUser).
      then(done.fail, done);
  });

  it('should reject user with an invalid picture URL', function(done) {
    testUser.picture = 'http://some.invalid.picture/hello/world';
    return User.
      create(testUser).
      then(done.fail, done);
  });

  it('should reject user not from Twitter/Facebook', function(done) {
    testUser.account = 'github';
    return User.
      create(testUser).
      then(done.fail, done);
  });

  it('should set register date upon creating user', function(done) {
    const before = Date.now();
    return User.
      create(testUser).
      then(function(doc) {
        expect(doc.registerDate.getTime()).not.toBeLessThan(before);
        expect(doc.registerDate.getTime()).not.toBeGreaterThan(Date.now());
        done();
      }).
      catch(done.fail);
  });

  describe('signin statics', function() {
    const existingUsers = [{
      name: 'First User',
      picture: 'http://www.example.com/first/user.jpg',
      account: 'facebook',
      socialMediaId: 123456
    }, {
      name: 'Second User',
      picture: 'https://example.org/second.png',
      account: 'twitter',
      socialMediaId: 654321
    }];

    beforeEach(function(done) {
      return User.
        insertMany(existingUsers).
        then(done, done.fail);
    });

    it('can identify and update an existing user', function(done) {
      const updatedUser = {
        name: 'new name',
        picture: 'https://new.com/pic.svg',
        account: 'facebook',
        socialMediaId: 123456
      };

      return User.
        signin(updatedUser).
        then(function(doc) {
          return User.
            find({}).
            exec();
        }).
        then(function(docs) {
          expect(docs.length).toBe(existingUsers.length);
          expect(docs).toContain(jasmine.objectContaining(updatedUser));
          done();
        }).
        catch(done.fail);
    });

    it('can register a new user', function(done) {
      const newUser = {
        name: 'a New usEr',
        account: 'facebook',
        socialMediaId: 42,
        picture: 'http://fourty-two.com/42.jpg'
      };

      return User.
        signin(newUser).
        then(function() {
          return User.
            find({}).
            exec();
        }).
        then(function(docs) {
          expect(docs.length).toBe(existingUsers.length + 1);
          expect(docs).toContain(jasmine.objectContaining(newUser));
          return done();
        }).
        catch(done.fail);
    });
  });

  describe('deserialize statics', function() {
    let id;

    beforeEach(function(done) {
      return User.
        create(testUser).
        then(function(doc) {
          id = doc._id;
          return done();
        }).
        catch(done.fail);
    });

    it('can find user doc based on her id', function(done) {
      return User.
        deserialize(id).
        then(function(doc) {
          expect(doc).toEqual(jasmine.objectContaining(testUser));
          return done();
        }).
        catch(done.fail);
    });

    it('rejects the promise if id is not found', function(done) {
      const randomId = '58a7165b64098e16a0718e91';
      return User.
        deserialize(randomId).
        then(done.fail, done);
    });
  });
});
