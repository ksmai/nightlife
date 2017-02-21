'use strict';

describe('errorDisplayer component', function() {
  let ctrl;

  beforeEach(module('core.errorDisplayer'));

  beforeEach(inject(function($componentController) {
    ctrl = $componentController('errorDisplayer');
    spyOn(ctrl.error, 'markAsRead');
  }));

  it('marks the error message as read when closed', function() {
    expect(ctrl.error.markAsRead).not.toHaveBeenCalled();
    ctrl.close();
    expect(ctrl.error.markAsRead).toHaveBeenCalled();
  });
});
