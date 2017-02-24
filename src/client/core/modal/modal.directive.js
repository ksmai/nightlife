(function() {
  'use strict';
  angular.
    module('core.modal').
    directive('modal', modalFactory);

  modalFactory.$inject = [];
  function modalFactory() {
    return {
      transclude: {
        header: '?modal-header',
        body: 'modal-body',
        footer: '?modal-footer'
      },
      restrict: 'E',
      scope: {
        visible: '='
      },
      templateUrl: '/core/modal/modal.template.html'
      
    };
  }
}());
