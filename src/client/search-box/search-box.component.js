(function() {
  'use strict';
  angular.
    module('app.searchBox').
    component('searchBox', {
      templateUrl: '/search-box/search-box.template.html',
      controller: SearchBoxController,
      controllerAs: 'vm'
    });

  SearchBoxController.$inject = ['$location', '$scope', '$window',
    'loginService', 'errorDisplayer', '$routeParams'];
  function SearchBoxController($location, $scope, $window, loginService,
    errorDisplayer, $routeParams) {
    const vm = this;
    vm.user = loginService;
    vm.search = search;
    vm.query = $routeParams.query;
    vm.hasGeolocation = 'geolocation' in $window.navigator;

    function search(auto) {
      if(auto) {
        $window.navigator.geolocation.getCurrentPosition(
          locationSuccessHandler, locationErrorHandler);
      } else if(vm.query) {
        $location.path(`/search/${vm.query}`);
      }

      function locationSuccessHandler(position) {
        $scope.$apply(function() {
          vm.query =
            `${position.coords.latitude},${position.coords.longitude}`;
          $location.path(`/search/${vm.query}`);
        });
      }

      function locationErrorHandler(err) {
        $scope.$apply(function() {
          vm.hasGeolocation = false;
          errorDisplayer.setMessage(err && err.message || 'Fail to detect your location. Please review your privacy settings.');
        });
      }
    }
  }
}());
