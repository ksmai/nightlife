'use strict';

module.exports = function deserialize(id) {
  return this.
    findById(id).
    exec().
    then(function(doc) {
      if(!doc) throw new Error(`User ID ${id} cannot be deserialized!`);
      return doc;
    });
};
