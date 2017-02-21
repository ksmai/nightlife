'use strict';

describe('searchBox component', function() {
  let ctrl, $location, $window;
  const query = 'some query';

  beforeEach(module('app.searchBox'));

  beforeEach(inject(function($componentController, _$location_,
    $routeParams, _$window_) {
    $routeParams.query = query;

    $location = _$location_;
    spyOn($location, 'path');

    $window = _$window_;
    spyOn($window.navigator.geolocation, 'getCurrentPosition');

    ctrl = $componentController('searchBox');
  }));

  it('reads route parameters', function() {
    expect(ctrl.query).toBe(query);
  });

  it('searches with current query parameters', function() {
    expect($location.path).not.toHaveBeenCalled();

    const newQuery = 'my new query';
    ctrl.query = newQuery;
    ctrl.search();

    expect($location.path).toHaveBeenCalledWith(`/search/${newQuery}`);
  });

  it('access geolocation.getCurrentPosition', function() {
    expect($window.navigator.geolocation.getCurrentPosition).
      not.toHaveBeenCalled();
    ctrl.search(true);
    expect($window.navigator.geolocation.getCurrentPosition).
      toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
  });

});
