(function() {
  'use strict';
  angular.
    module('app').
    config(configMainRoute);

  configMainRoute.$inject = ['$locationProvider', '$routeProvider'];
  function configMainRoute($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.
      when('/', {
        template: '<search-box></search-box>'
      }).
      otherwise('/');
  }
}());
