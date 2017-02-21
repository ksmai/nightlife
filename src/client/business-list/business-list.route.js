(function() {
  'use strict';
  angular.
    module('app.businessList').
    config(configSearchRoute);

  configSearchRoute.$inject = ['$routeProvider'];
  function configSearchRoute($routeProvider) {
    $routeProvider.
      when('/search/:query', {
        template: '<business-list></business-list>'
      });
  }
}());
