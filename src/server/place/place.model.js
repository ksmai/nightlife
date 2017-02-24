'use strict';
const mongoose  = require('mongoose');
const join      = require('./join.statics');
const unjoin    = require('./unjoin.statics');
const getCounts = require('./get-counts.statics');

mongoose.Promise = global.Promise;

const placeSpec = {
  _id: {
    type: String,
    required: true,
    unique: true
  },
  participants: {
    type: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      joinDate: {
        type: Date,
        default: Date.now
      },
      _id: false
    }],
    default: []
  }
};

const placeSchema = new mongoose.Schema(placeSpec);
placeSchema.statics.join      = join;
placeSchema.statics.unjoin    = unjoin;
placeSchema.statics.getCounts = getCounts;
placeSchema.virtual('count').get(countUserWithinToday);
placeSchema.set('toJSON',   { virtuals: true });
placeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Place', placeSchema, 'places');

////////////////////

function countUserWithinToday() {
  const hoursPerDay      = 24;
  const minutesPerHour   = 60;
  const secondsPerMinute = 60;
  const msPerSecond      = 1000;
  const oneDayAgo        = Date.now() - hoursPerDay * minutesPerHour *
    secondsPerMinute * msPerSecond;
  return this.
    participants.
    filter(function(participant) {
      return participant.joinDate.getTime() > oneDayAgo;
    }).
    length;
}

