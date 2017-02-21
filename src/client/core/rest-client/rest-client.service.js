(function() {
  'use strict';
  angular.
    module('core.restClient').
    factory('restClient', restClientFactory);

  restClientFactory.$inject = ['$resource'];
  function restClientFactory($resource) {
    return $resource('/api/v1/:resource/:id', {id: '@id'}, {
      join: {
        method: 'POST',
        params: { resource: 'join' }
      },
      unjoin: {
        method: 'POST',
        params: { resource: 'unjoin' }
      },
      list: {
        method: 'GET',
        params: { resource: 'business' }
      }
    });
  }
}());
