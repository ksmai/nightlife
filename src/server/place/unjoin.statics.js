'use strict';

module.exports = function unjoin({placeId, userId}) {
  const query = {
    _id: placeId,
    'participants.user': userId
  };
  const update = {
    $pull: {
      participants: { user: userId }
    }
  };
  const options = {
    new: true,
    runValidators: true
  };

  return this.
    findOneAndUpdate(query, update, options).
    exec().
    then(function(doc) {
      if(!doc) throw new Error(`Cannot unjoin place: ${placeId}`);
      return doc;
    });
};
