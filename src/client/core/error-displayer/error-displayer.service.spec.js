'use strict';

describe('errorDisplayer service', function() {
  let errorDisplayer;

  beforeEach(module('core.errorDisplayer'));

  beforeEach(inject(function(_errorDisplayer_) {
    errorDisplayer = _errorDisplayer_;
  }));

  it('initializes without any messages', function() {
    expect(errorDisplayer.message).toBe('');
    expect(errorDisplayer.new).toBe(false);
  });

  it('can set a new message and mark it as new', function() {
    const msg = 'My cool message!';

    expect(errorDisplayer.message).not.toBe(msg);
    expect(errorDisplayer.new).not.toBe(true);

    errorDisplayer.setMessage(msg);
    expect(errorDisplayer.message).toBe(msg);
    expect(errorDisplayer.new).toBe(true);
  });

  it('can mark a new message as read', function() {
    expect(errorDisplayer.new).toBe(false);
    errorDisplayer.setMessage('aeva');
    expect(errorDisplayer.new).toBe(true);
    errorDisplayer.markAsRead();
    expect(errorDisplayer.new).toBe(false);
  });
});
