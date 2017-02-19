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
    then(() => {
      return this.find(query).exec();
    }).
    then((docs) => {
      if(docs.length !== ids.length) {
        const newIds = ids.slice();
        docs.forEach(function(doc) {
          const idx = newIds.indexOf(doc._id);
          if(idx === -1) throw new Error(`Cannot get counts for ${ids}`);
          newIds.splice(idx, 1);
        });

        const newDocs = newIds.map((id) => ({_id: id}));

        return this.
          insertMany(newDocs).
          then(() => {
            return this.find(query).exec();
          });
      }

      return docs;
    }).
    then(function(docs) {
      return docs.sort(function(a, b) {
        if(ids.indexOf(a._id) < ids.indexOf(b._id)) return -1;
        return 1;
      });
    });
};
