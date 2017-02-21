(function() {
  'use strict';
  angular.
    module('core.errorDisplayer').
    component('errorDisplayer', {
      templateUrl: '/core/error-displayer/error-displayer.template.html',
      controller: ErrorDisplayerController,
      controllerAs: 'vm'
    });

  ErrorDisplayerController.$inject = ['errorDisplayer'];
  function ErrorDisplayerController(errorDisplayer) {
    const vm = this;
    vm.error = errorDisplayer;
    vm.close = close;

    function close() {
      vm.error.markAsRead();
    }
  }
}());
