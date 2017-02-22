'use strict';

describe('onMain directive', function() {
  let $rootScope, $location, element;
  const attr = 'abcde';

  beforeEach(module('app.core'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$location_) {
    $rootScope = _$rootScope_;
    $location = _$location_;

    spyOn($location, 'path').and.returnValues('/', '/a', '/');

    element = _$compile_(`<p on-main="${attr}"></p>`)($rootScope);
  }));

  it('checks current path and add class to the element at "/"',
    function() {
      expect($location.path).toHaveBeenCalledTimes(1);
      expect(element.hasClass(attr)).toBe(true);
      expect(element.hasClass(`not-${attr}`)).toBe(false);
    }
  );

  it('listens to the routeChangeSuccess event and toggle class accordingly',
    function() {
      /* eslint no-magic-numbers: "off" */
      $rootScope.$broadcast('$routeChangeSuccess');
      expect($location.path).toHaveBeenCalledTimes(2);
      expect(element.hasClass(`not-${attr}`)).toBe(true);
      expect(element.hasClass(attr)).toBe(false);

      $rootScope.$broadcast('$routeChangeSuccess');
      expect($location.path).toHaveBeenCalledTimes(3);
      expect(element.hasClass(`not-${attr}`)).toBe(false);
      expect(element.hasClass(attr)).toBe(true);
    }
  );
});
