'use strict';

describe('businessList component', function() {
  let ctrl, restClient;
  const query = 'sf';
  const name = 'John Doe';

  beforeEach(module('app.businessList'));

  beforeEach(inject(function($componentController, $routeParams,
    _restClient_, _loginService_) {
    $routeParams.query = query;

    restClient = _restClient_;
    spyOn(restClient, 'list');
    spyOn(restClient, 'join');
    spyOn(restClient, 'unjoin');

    _loginService_.data = { name };

    ctrl = $componentController('businessList');
  }));

  it('uses the rest client to load a list', function() {
    expect(ctrl.query).toBe(query);
    expect(restClient.list).toHaveBeenCalledWith({ loc: query },
      jasmine.any(Function), jasmine.any(Function));
  });

  it('loads user info', function() {
    expect(ctrl.user).toEqual(jasmine.objectContaining({ data: { name } }));
  });

  it('disallow join/unjoin when waiting for user info', function() {
    ctrl.user.pending = true;
    expect(restClient.join).not.toHaveBeenCalled();
    ctrl.join('123');
    expect(restClient.join).not.toHaveBeenCalled();

    expect(restClient.unjoin).not.toHaveBeenCalled();
    ctrl.unjoin('abc');
    expect(restClient.unjoin).not.toHaveBeenCalled();
  });

  it('disallow join/unjoin without user data', function() {
    delete ctrl.user.data;
    expect(ctrl.user.data).not.toBeDefined();

    expect(restClient.join).not.toHaveBeenCalled();
    ctrl.join('123');
    expect(restClient.join).not.toHaveBeenCalled();

    expect(restClient.unjoin).not.toHaveBeenCalled();
    ctrl.unjoin('abc');
    expect(restClient.unjoin).not.toHaveBeenCalled();
  });

  it('use rest client to join/unjoin', function() {
    ctrl.user.pending = false;

    expect(restClient.join).not.toHaveBeenCalled();
    ctrl.join({ id: '123' });
    expect(restClient.join).toHaveBeenCalledWith({ id: '123' }, {},
      jasmine.any(Function), jasmine.any(Function));

    expect(restClient.unjoin).not.toHaveBeenCalled();
    ctrl.unjoin({ id: 'abc' });
    expect(restClient.unjoin).toHaveBeenCalledWith({ id: 'abc' }, {},
      jasmine.any(Function), jasmine.any(Function));
  });

  it('parses lat/lon correctly', inject(function($componentController,
    $routeParams, _restClient_) {

    $routeParams.query = ' ( +123.45, -33.330 ) ';
    $componentController('businessList');
    expect(_restClient_.list).toHaveBeenCalledWith(
      { ll: '123.45,-33.330' },
      jasmine.any(Function),
      jasmine.any(Function));
  }));

  it('creates a range of number', function() {
    /* eslint no-magic-numbers: "off" */
    expect(ctrl.range(5)).toEqual([0, 1, 2, 3, 4]);
    expect(ctrl.range('5.5')).toEqual([0, 1, 2, 3, 4]);
  });

  it('identifies half number', function() {
    expect(ctrl.isHalf('9.5')).toBe(true);
    expect(ctrl.isHalf('.500')).toBe(true);
    expect(ctrl.isHalf('.05')).toBe(false);
  });

});
