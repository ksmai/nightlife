'use strict';

describe('blurOnRouteChange directive', function() {
  let element, $rootScope, $timeout;

  beforeEach(module('core.blurOnRouteChange'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_) {
    element = _$compile_('<input blur-on-route-change type="text">')(
      _$rootScope_);

    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  it('blurs on route change', function() {
    spyOn(element[0], 'blur');
    expect(element[0].blur).not.toHaveBeenCalled();

    $rootScope.$emit('$routeChangeSuccess');
    expect(element[0].blur).not.toHaveBeenCalled();

    $timeout.flush();
    expect(element[0].blur).toHaveBeenCalled();
  });
});
