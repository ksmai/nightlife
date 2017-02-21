(function() {
  'use strict';
  angular.
    module('app.businessList').
    component('businessList', {
      templateUrl: '/business-list/business-list.template.html',
      controller: BusinessListController,
      controllerAs: 'vm'
    });

  BusinessListController.$inject = ['$routeParams', 'restClient',
    '$location', 'loginService', 'errorDisplayer'];
  function BusinessListController($routeParams, restClient,
    $location, loginService, errorDisplayer) {
    const vm = this;
    vm.query = $routeParams.query;
    vm.join = join;
    vm.unjoin = unjoin;
    vm.user = loginService;

    activate();

    function activate() {
      const coordsRegex = /^\W*?(-?\d+(?:\.\d+)?)\W+?(-?\d+(?:\.\d+)?)\W*$/;
      const match = vm.query.match(coordsRegex);
      if(match) {
        vm.businesses = restClient.list({ ll: match.slice(1).join(',') },
          listSuccess, errorHandler);
      } else {
        vm.businesses = restClient.list({ loc: vm.query },
          listSuccess, errorHandler.bind(null, null));
      }
    }

    function join(busi) {
      if(vm.user.pending) return;

      if(!vm.user.data) {
        errorDisplayer.setMessage('Please login.');
        return;
      }

      busi.pending = true;
      restClient.join({ id: busi.id }, {}, joinSuccess.bind(null, busi),
        errorHandler.bind(null, busi));
    }

    function unjoin(busi) {
      if(vm.user.pending) return;

      if(!vm.user.data) {
        errorDisplayer.setMessage('Please login.');
        return;
      }

      busi.pending = true;
      restClient.unjoin({ id: busi.id }, {}, joinSuccess.bind(null, busi),
        errorHandler.bind(null, busi));
    }

    function joinSuccess(busi, value, headers, status, statusText) {
      const OK = 200;
      busi.pending = false;
      if(status === OK) {
        busi.done = true;
      } else {
        errorHandler(busi, { value, headers, status, statusText });
      }
    }

    function listSuccess(value, headers, status, statusText) {
      const OK = 200;
      if(status !== OK) {
        errorHandler(null, { value, headers, status, statusText });
      }
    }

    function errorHandler(busi, res) {
      if(busi) {
        busi.pending = false;
        errorDisplayer.setMessage('An error occurred. Please try again later.');
      } else {
        errorDisplayer.setMessage(`No results found for ${vm.query}.`);
        $location.path('/');
      }
    }
  }
}());
