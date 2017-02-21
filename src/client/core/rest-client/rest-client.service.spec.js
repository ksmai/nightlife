'use strict';

describe('restClient service', function() {
  let restClient, $httpBackend;

  const businesses = {
    businesses: [
      { _id: '123' },
      { _id: '456' },
      { _id: '789' }
    ],
    region: 'abc'
  };

  beforeEach(module('core.restClient'));

  beforeEach(inject(function(_$httpBackend_, _restClient_) {
    $httpBackend = _$httpBackend_;
    restClient = _restClient_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('can get a list of businesses', function() {
    const loc = 'sf';
    $httpBackend.expectGET(`/api/v1/business?loc=${loc}`).
      respond(businesses);

    const result = restClient.list({ loc });
    expect(result).not.toEqual(jasmine.objectContaining(businesses));

    $httpBackend.flush();
    expect(result).toEqual(jasmine.objectContaining(businesses));
  });

  it('can join a place', function() {
    const id = 'some id';
    const OK = 200;
    $httpBackend.expectPOST(`/api/v1/join/${encodeURIComponent(id)}`).
      respond(OK);

    restClient.join({ id });
    $httpBackend.flush();
  });

  it('can unjoin a place', function() {
    const id = 'myidWithoutSpecialCharactersThisTime';
    const OK = 200;
    $httpBackend.expectPOST(`/api/v1/unjoin/${id}`).respond(OK);

    restClient.unjoin({ id });
    $httpBackend.flush();
  });

});
