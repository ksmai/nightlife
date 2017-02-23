'use strict';

describe('Nightlife', function() {
  describe('Main page', function() {
    beforeEach(function() {
      browser.ignoreSynchronization = true;
      browser.get('/');
    });

    afterEach(function() {
      browser.ignoreSynchronization = false;
    });

    it('should take a query from user and redirect to the result',
      function() {
        const searchField = element(by.model('vm.query'));
        const submitBtn = element(by.css('[type="submit"]'));
        const query = 'MyQuery';

        searchField.sendKeys(query);
        submitBtn.click();

        expect(browser.getCurrentUrl()).toMatch(new RegExp(
          `/search/${query}$`, 'i'));
      }
    );

    it('should let user to use their location for search', function() {
      element(by.css('.search-form')).all(by.tagName('button')).
        get(1).click();
      expect(browser.getCurrentUrl()).toMatch(/\/search\/-?\d+(\.\d+)?,\d+(\.\d+)?/i);
    });

    it('should bring user back to top of page when back-to-top button is clicked', function() {
      element(by.css('.try-button')).click();
      expect(browser.getCurrentUrl()).toMatch(/\/#top$/i);
    });

    it('should log user in with facebook', function() {
      element(by.css('.login-fb')).click();
      expect(browser.getCurrentUrl()).toMatch(/facebook/i);
    });

    it('should log user in with twitter', function() {
      element(by.css('.login-tt')).click();
      expect(browser.getCurrentUrl()).toMatch(/twitter/i);
    });
  });

  describe('result page', function() {
    let items;
    
    beforeEach(function() {
      browser.get('/search/sf');
      items = element.all(by.repeater('busi in vm.businesses.businesses'));
    });

    it('brings user back to homepage by clicking on logo', function() {
      element(by.css('.logo')).click();
      expect(browser.getCurrentUrl()).toMatch(/\/$/);
    });

    it('displays results', function() {
      expect(items.count()).toBeGreaterThan(0);
    });

    it('redirect user to yelp page', function() {
      const url = items.get(0).element(by.css('.busi-info')).
        element(by.tagName('a')).getAttribute('href');
      expect(url).toMatch(/yelp/i);
    });

    it('redirect to home page if no result found', function() {
      const error = element(by.css('.error-displayer'));
      expect(error.isDisplayed()).toBe(false);

      element(by.tagName('input')).sendKeys('avsrasveebetnndntnyt');
      element(by.css('[type="submit"]')).click();

      expect(browser.getCurrentUrl()).not.toMatch(/search/i);
      expect(error.isDisplayed()).toBe(true);

      error.element(by.tagName('button')).click();
      expect(error.isDisplayed()).toBe(false);
    });

    it('scrolls back to top and asks user to login when user try to join',
      function() {
        const error = element(by.css('.error-displayer'));
        expect(error.isDisplayed()).toBe(false);

        items.get(0).element(by.css('.busi-action button')).click();
        expect(error.isDisplayed()).toBe(true);
        expect(browser.getCurrentUrl()).toMatch(/#top$/i);

        error.element(by.tagName('button')).click();
        expect(error.isDisplayed()).toBe(false);
      }
    );
  });
}); 
