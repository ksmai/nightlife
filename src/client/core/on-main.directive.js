(function() {
  'use strict';
  angular.
    module('app.core').
    directive('onMain', onMainFactory);

  onMainFactory.$inject = ['$rootScope', '$location'];
  function onMainFactory($rootScope, $location) {
    return {
      restrict: 'A',
      link: link
    };

    function link(scope, elem, attr) {
      toggleClass();
      $rootScope.$on('$routeChangeSuccess', toggleClass);

      function toggleClass() {
        if($location.path() === '/') {
          elem.addClass(attr.onMain);
        } else {
          elem.removeClass(attr.onMain);
        }
      }
    }
  }
}());
