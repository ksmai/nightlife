'use strict';

describe('loginService service', function() {
  let loginService, $httpBackend;

  const testUser = {
    name: 'my awesome Name',
    _id: '123'
  };

  beforeEach(module('app.core'));

  beforeEach(inject(function(_loginService_, _$httpBackend_) {
    loginService = _loginService_;
    $httpBackend = _$httpBackend_;

    $httpBackend.expectGET('/auth/me').respond(testUser);
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('fetches user data', function() {
    expect(loginService.pending).toBe(true);
    expect(loginService.data).not.toBeDefined();
    $httpBackend.flush();
    expect(loginService.pending).toBe(false);
    expect(loginService.data).toEqual(testUser);
  });
});
