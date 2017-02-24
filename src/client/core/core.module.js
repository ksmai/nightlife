(function() {
  'use strict';
  angular.module('app.core', [
    'core.restClient',
    'core.errorDisplayer',
    'core.onMain',
    'core.blurOnRouteChange'
  ]);
}());
