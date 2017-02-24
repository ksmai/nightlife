(function() {
  'use strict';
  angular.
    module('app.featureList').
    component('featureList', {
      templateUrl: '/feature-list/feature-list.template.html',
      controller: FeatureListController,
      controllerAs: 'vm'
    });

  FeatureListController.$inject = ['$location', '$anchorScroll',
    'features'];
  function FeatureListController($location, $anchorScroll, features) {
    const vm = this;
    vm.tryNow = tryNow;
    vm.features = features;

    function tryNow() {
      $location.hash('top');
      $anchorScroll();
    }
  }
}());
