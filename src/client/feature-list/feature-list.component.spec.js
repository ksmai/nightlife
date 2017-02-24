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

  it('specifies a list of features', function() {
    expect(ctrl.features).toEqual(jasmine.any(Array));
    expect(ctrl.features.length).toBeGreaterThan(0);
    expect(ctrl.features[0].img).toBeDefined();
    expect(ctrl.features[0].caption).toBeDefined();
  });
});

