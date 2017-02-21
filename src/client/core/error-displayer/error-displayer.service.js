(function() {
  'use strict';
  angular.
    module('core.errorDisplayer').
    factory('errorDisplayer', errorDisplayerFactory);

  errorDisplayerFactory.$inject = [];
  function errorDisplayerFactory() {
    return {
      message: '',
      new: false,
      setMessage,
      markAsRead
    };
    ////////////////////

    function setMessage(msg) {
      this.message = msg;
      this.new = true;
      return this;
    }

    function markAsRead() {
      this.new = false;
      return this;
    }
  }
}());
