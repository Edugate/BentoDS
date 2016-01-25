
var dsDirectives = angular.module('dsDirectives', []);
/* Directives */
dsDirectives.directive('errSrc', function () {
  'use strict';
    return {
        link: function (scope, element, attrs) {

            scope.$watch(function () {
                return attrs.ngSrc;
            }, function (value) {
                if (!value) {
                    element.attr('src', attrs.errSrc);
                }
            });

            element.bind('error', function () {
                element.attr('src', attrs.errSrc);
            });
        }
    };
});
dsDirectives.directive('distanceInKm', function () {
  'use strict';
    return {
        template: '{{idp.distance}} km'

    };
});
