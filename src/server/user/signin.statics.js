'use strict';

module.exports = function signin({socialMediaId, account, name, picture}) {
  return this.
    findOneAndUpdate({
      socialMediaId,
      account
    }, {
      $set: {
        name,
        picture
      }
    }, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    }).
    exec();
};
