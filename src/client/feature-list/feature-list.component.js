(function() {
  'use strict';
  angular.
    module('app.featureList').
    component('featureList', {
      templateUrl: '/feature-list/feature-list.template.html',
      controller: FeatureListController,
      controllerAs: 'vm'
    });

  FeatureListController.$inject = ['$location', '$anchorScroll'];
  function FeatureListController($location, $anchorScroll) {
    const vm = this;

    vm.tryNow = tryNow;

    function tryNow() {
      $location.hash('top');
      $anchorScroll();
    }
  }
}());
