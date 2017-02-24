(function() {
  'use strict';
  angular.
    module('core.blurOnRouteChange').
    directive('blurOnRouteChange', blurOnRouteChangeFactory);

  blurOnRouteChangeFactory.$inject = ['$rootScope', '$timeout'];
  function blurOnRouteChangeFactory($rootScope, $timeout) {
    return {
      restrict: 'A',
      link: link
    };

    function link(scope, elem) {
      $rootScope.$on('$routeChangeSuccess', function() {
        $timeout(function() {
          elem[0].blur();
        }, 0);
      });
    }
  }
}());
