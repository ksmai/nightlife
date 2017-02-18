'use strict';

module.exports = function join({placeId, userId}) {
  const query = {
    _id: placeId,
    'participants.user': { $ne: userId }
  };
  const update = { $push: { participants: { user: userId } } };
  const options = {
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true
  };

  return this.
    findOneAndUpdate(query, update, options).
    exec().
    then(function(doc) {
      if(!doc) throw new Error(`Cannot join place: ${placeId}!`);
      return doc;
    });
};
