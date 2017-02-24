(function() {
  'use strict';
  angular.
    module('core.onMain').
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
          elem.removeClass(`not-${attr.onMain}`);
        } else {
          elem.addClass(`not-${attr.onMain}`);
          elem.removeClass(attr.onMain);
        }
      }
    }
  }
}());
