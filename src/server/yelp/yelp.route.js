'use strict';
const express    = require('express');
const httpStatus = require('http-status');
const Place      = require('../place/place.model');
const yelp       = require('./yelp');

const router = express.Router();
router.get('/business', getBusiness);
router.use(errorHandler);

module.exports = router;
////////////////////

function getBusiness(req, res, next) {
  if(!req.query.loc && !req.query.ll) {
    next(new Error('Missing query parameters: loc/ll'));
    return;
  }

  let loc = req.query.loc;
  if(!loc) {
    loc = {};
    [loc.lat, loc.lon] = req.query.ll.split(',');
    if(!isValidCoord(loc)) {
      next(new Error('Bad query parameter: ll'));
      return;
    }
  }

  yelp(loc).
    then(function(response) {
      const ids = response.businesses.map(busi => busi.id);

      return Place.
        getCounts(ids).
        then(function(docs) {
          if(docs.length !== ids.length) throw new Error();

          response.businesses.forEach(function(busi, idx) {
            if(busi.id.trim() !== docs[idx]._id) throw new Error();

            busi.joinCount = docs[idx].count;

            if(req.user) {
              busi.hasJoined = docs[idx].
                participants.
                map((participant) => participant.user.toString()).
                indexOf(req.user._id.toString()) > -1;
            }
          });

          return res.json(response);
        });
    }).
    catch(function(err) {
      next(new Error('BAD REQUEST'));
    });
}

function isValidCoord(loc) {
  const reg = /^-?\d+(?:\.\d+)?$/;
  return loc.lat && loc.lon && reg.test(loc.lat) && reg.test(loc.lon);
}

function errorHandler(err, req, res, next) {
  res.status(httpStatus.BAD_REQUEST).send(err.toString());
}
