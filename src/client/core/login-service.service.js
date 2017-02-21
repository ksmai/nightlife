(function() {
  'use strict';
  angular.
    module('app.core').
    factory('loginService', loginServiceFactory);

  loginServiceFactory.$inject = ['$http', '$interval'];
  function loginServiceFactory($http, $interval) {
    const user = {
      load,
      pending: false
    };

    load();

    const halfHour = 1800000;
    $interval(load, halfHour);

    return user;
    ////////////////////

    function load() {
      user.pending = true;

      $http.
        get('/auth/me').
        then(function(res) {
          user.data = res.data;
          return res;
        }, function(err) {
          delete user.data;
        }).
        then(function() {
          user.pending = false;
        });
    }

  }
}());
