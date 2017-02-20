(function() {
  'use strict';
  angular.
    module('app.searchBox').
    component('searchBox', {
      templateUrl: '/search-box/search-box.template.html',
      controller: SearchBoxController,
      controllerAs: 'vm'
    });

  SearchBoxController.$inject = ['$location', '$scope'];
  function SearchBoxController($location, $scope) {
    const vm = this;
    vm.search = search;
    vm.hasGeolocation = 'geolocation' in window.navigator;

    function search(auto) {
      if(auto) {
        window.navigator.geolocation.getCurrentPosition(
          locationSuccessHandler, locationErrorHandler);
      } else {
        $location.path(`/search/${vm.query}`);
      }

      function locationSuccessHandler(position) {
        vm.query =
          `${position.coords.latitude},${position.coords.longitude}`;
        $scope.$apply();
        $location.path(`/search/${vm.query}`);
      }

      function locationErrorHandler(err) {
        vm.query = err.message;
      }
    }
  }
}());
