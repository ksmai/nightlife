'use strict';
const mongoose = require('mongoose');
const signin = require('./signin.statics');
const deserialize = require('./deserialize.statics');

mongoose.Promise = global.Promise;

const userSpec = {
  name: {
    type: String,
    required: true,
    trim: true
  },
  picture: {
    type: String,
    required: true,
    trim: true,
    match: /^https?:\/\/.+(?:\..+){1,2}\/.+/
  },
  account: {
    type: String,
    required: true,
    enum: ['facebook', 'twitter'],
    index: true
  },
  socialMediaId: {
    type: Number,
    required: true,
    index: true
  },
  registerDate: {
    type: Date,
    default: Date.now
  }
};

const userSchema = new mongoose.Schema(userSpec);
userSchema.statics.signin = signin;
userSchema.statics.deserialize = deserialize;

module.exports = mongoose.model('User', userSchema, 'users');
