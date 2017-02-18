'use strict';

module.exports = function getCounts(places) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const ids = Array.isArray(places)
    ? places
    : [places];
  const query = { _id: { $in: ids } };
  const update =
    { $pull: { participants: { joinDate: { $lt: yesterday } } } };
  const options = {
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
    multi: true
  };

  return this.
    update(query, update, options).
    then(function() {
      return this.find(query).exec();
    }).
    then(function(docs) {
      if(docs.length !== ids.length) {
        throw new Error(`Fail to get counts for: ${places}`);
      }

      return docs.sort(function(a, b) {
        if(ids.indexOf(a._id) < ids.indexOf(b._id)) return -1;
        return 1;
      });
    });
};
