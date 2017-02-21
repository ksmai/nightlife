(function() {
  'use strict';
  angular.
    module('app.featureList').
    config(configMainRoute);

  configMainRoute.$inject = ['$locationProvider', '$routeProvider'];
  function configMainRoute($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.
      when('/', {
        template: '<feature-list></feature-list>'
      }).
      otherwise('/');
  }
}());
