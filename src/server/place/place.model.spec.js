'use strict';
const Place = require('./place.model');
const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost/test';

describe('Place model', function() {
  const testPlace = { _id: 'some string id' };

  const testPlaceWithParticipants = {
    _id: 'test place with participants',
    participants: [{ user: '58a7cd92730a7a0a0c1657b8' }, {
      user: '58a7d266961f1a0ec4b443de',
      joinDate: new Date('2017-02-01T00:00:00Z')
    }]
  };

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
    return Place.
      remove({}).
      then(done, done.fail);
  });

  it('accepts a string as _id', function(done) {
    return Place.
      create(testPlace).
      then(done, done.fail);
  });

  it('intializes an empty participants array', function(done) {
    return Place.
      create(testPlace).
      then(function() {
        return Place.find(testPlace).exec();
      }).
      then(function(docs) {
        expect(docs.length).toBe(1);
        expect(docs).toContain(jasmine.objectContaining(testPlace));
        expect(docs[0].participants.length).toBe(0);
        return done();
      }).
      catch(done.fail);
  });

  it('provides total number of user joined within a day', function(done) {
    return Place.
      create(testPlaceWithParticipants).
      then(function(doc) {
        expect(doc.participants.length).
          toBe(testPlaceWithParticipants.participants.length);
        expect(doc.count).toBe(1);
        done();
      }).
      catch(done.fail);
  });

  describe('- join statics', function() {
    const defaultPlace = {
      _id: 'An existing place',
      participants: [{
        user: '58a83ccb2284041254978d4b',
        joinDate: Date.now()
      }, {
        user: '58a30e014b263b1fa88fc339',
        joinDate: new Date(new Date().getUTCFullYear() - 1, 1, 1)
      }]
    };

    const newUser = '589dace8699dc17a265139f8';

    it('should allow user to join existing place', function(done) {
      return Place.
        create(defaultPlace).
        then(function() {
          return Place.join({
            userId: newUser,
            placeId: defaultPlace._id
          });
        }).
        then(function(doc) {
          expect(doc.participants.length).
            toBe(defaultPlace.participants.length + 1);

          expect(doc.participants.map(function(participant) {
            return {
              user: participant.user.toString(),
              joinDate: participant.joinDate
            };
          })).
            toContain(jasmine.objectContaining(
              { user: newUser }));

          return done();
        }).
        catch(done.fail);
    });

    it('set joinDate correctly', function(done) {
      const before = Date.now();

      return Place.
        create({ _id: defaultPlace._id }).
        then(function() {
          return Place.join({
            placeId: defaultPlace._id,
            userId: newUser
          });
        }).
        then(function(doc) {
          expect(doc.participants.length).toBe(1);
          expect(doc.count).toBe(1);
          expect(doc.participants[0].joinDate.getTime()).
            not.toBeLessThan(before);
          expect(doc.participants[0].joinDate.getTime()).
            not.toBeGreaterThan(Date.now());
          done();
        }).
        catch(done.fail);
    });

    it('disallow user to join non-existent place', function(done) {
      return Place.
        join({
          userId: newUser,
          placeId: defaultPlace._id
        }).
        then(done.fail, done);
    });

    it('disallow user to join same place twice', function(done) {
      return Place.
        create(defaultPlace).
        then(function() {
          return Place.join({
            userId: newUser,
            placeId: defaultPlace._id
          });
        }).
        then(function() {
          return Place.join({
            userId: newUser,
            placeId: defaultPlace._id
          });
        }).
        then(done.fail, done);
    });
  });

  describe('- unjoin statics', function() {
    const defaultPlace = {
      _id: 'An existing place',
      participants: [{
        user: '58a83ccb2284041254978d4b',
        joinDate: Date.now()
      }, {
        user: '58a30e014b263b1fa88fc339',
        joinDate: new Date(new Date().getUTCFullYear() - 1, 1, 1)
      }]
    };

    it('allows user to unjoin a place', function(done) {
      return Place.
        create(defaultPlace).
        then(function(doc) {
          expect(doc.participants.length).
            toBe(defaultPlace.participants.length);
          return Place.
            unjoin({
              placeId: defaultPlace._id,
              userId: defaultPlace.participants[0].user
            });
        }).
        then(function(doc) {
          expect(doc.participants.length).
            toBeLessThan(defaultPlace.participants.length);
          expect(doc.participants[0].user.toString()).
            not.toEqual(defaultPlace.participants[0].user);
          return done();
        }).
        catch(done.fail);
    });

    it('disallows user to unjoin a place without joining before',
        function(done) {
          return Place.
            create(defaultPlace).
            then(function() {
              return Place.
                unjoin({
                  placeId: defaultPlace._id,
                  userId: '507f1f77bcf86cd799439011'
                });
            }).
            then(done.fail, done);
        }
    );

    it('disallow unjoining an non-existent place', function(done) {
      return Place.
        unjoin({
          placeId: defaultPlace._id,
          userId: defaultPlace.participants[0].user
        }).
        then(done.fail, done);
    });
  });

  describe('- getCount statics', function() {
    const existingPlaces = [{
      _id: 'place 1'
    }, {
      _id: 'place 2 with more people',
      participants: [{
        user: '58a83ccb2284041254978d4b'
      }, {
        user: '58a30e014b263b1fa88fc339',
        joinDate: new Date(new Date().getUTCFullYear() - 1, 1, 1)
      }]
    }];

    beforeEach(function(done) {
      return Place.
        insertMany(existingPlaces).
        then(done, done.fail);
    });

    it('can look up place with a single id (string)', function(done) {
      return Place.
        getCounts(existingPlaces[0]._id).
        then(function(docs) {
          expect(docs.length).toBe(1);
          expect(docs[0].participants.length).toBe(0);
          expect(docs[0].count).toBe(0);
          done();
        }).
        catch(done.fail);
    });

    it('can look up multiple places', function(done) {
      return Place.
        getCounts(existingPlaces.map(place => place._id)).
        then(function(docs) {
          expect(docs.length).toBe(existingPlaces.length);
          expect(docs.map(doc => doc._id)).
            toEqual(existingPlaces.map(place => place._id));
          done();
        }).
        catch(done.fail);
    });

    it('can upsert a new place', function(done) {
      const newId = 'A new empty place!';
      const ids = existingPlaces.
        map(place => place._id).
        concat([newId]);

      return Place.
        getCounts(ids).
        then(function(docs) {
          expect(docs.length).toBe(existingPlaces.length + 1);
          expect(docs[docs.length - 1]._id).toBe(newId);
          expect(docs[1].count).toBe(1);
          done();
        }).
        catch(done.fail);
    });

    it('can remove user joined more than 1 day ago', function(done) {
      return Place.
        getCounts(existingPlaces.map(place => place._id)).
        then(function(docs) {
          expect(docs.length).toBe(existingPlaces.length);
          expect(docs[1].count).
            toBeLessThan(existingPlaces[1].participants.length);
          expect(docs[1].participants[0].user.toString()).toBe(
            existingPlaces[1].participants[0].user.toString());
          done();
        }).
        catch(done.fail);
    });

    it('can sort result documents according to input ids', function(done) {
      const newId = 'a new id';
      const reordered = [
        existingPlaces[1]._id, newId, existingPlaces[0]._id];

      return Place.
        create({_id: newId}).
        then(function() {
          return Place.getCounts(reordered);
        }).
        then(function(docs) {
          expect(docs.length).toBe(reordered.length);
          expect(docs.map(doc => doc._id)).toEqual(reordered);
          expect(docs.map(doc => doc.count)).toEqual([1, 0, 0]);
          done();
        }).
        catch(done.fail);
    });

  });
});
