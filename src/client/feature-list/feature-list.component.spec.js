'use strict';

describe('featureList component', function() {
  let ctrl;

  beforeEach(module('app.featureList'));

  beforeEach(inject(function($componentController) {
    ctrl = $componentController('featureList');
  }));

  it('has a tryNow method', function() {
    expect(ctrl.tryNow).toBeDefined();
  });
});

