
(function() {
    "use strict";
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/* Discovery Service part */

var BentoDS = angular.module('BentoDS', [ // jshint ignore:line
    'base64',
    'ngRoute',
    'ngResource',
    'ipCookie',
    'ngMap',
    'ui.bootstrap',
    'dsControllers',
    'dsFilters',
    'dsServices',
    'dsDirectives'

]);

BentoDS.constant('config', {
    srcDataApp: '@@srcdataapp',
    srcIdPList: '@@srcidplist',
    srcRequesterInfo: '@@srcrequesterinfo',
    srcIdPListFallback: '@@srcidplistfallback',
    srcDataAppFallback: '@@srcdataappfallback'
});

BentoDS.config(['$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {
      "use strict";
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
        $routeProvider.when('/d', {
            templateUrl: 'partials/idp-list.html',
            controller: 'ProviderListCtrl'
        }).otherwise({

            templateUrl: 'partials/idp-list.html',
            controller: 'ProviderListCtrl'

        });
        //$compileProvider.aHrefSanitizationWhitelist(/#/);
    }

]);


var ModalInstanceCtrl = ['$rootScope', '$scope', '$uibModalInstance','$uibModal', 'item',function ($rootScope, $scope, $uibModalInstance, $uibModal, item) {

  "use strict";
    $scope.item = item;
    $scope.ok = function () {
        $uibModalInstance.close();

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.$on('mapInitialized', function (event, map) {
        google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
            google.maps.event.trigger(map, 'resize');
            if ($scope.item.geo.lat !== undefined) {
                var newLa = new google.maps.LatLng($scope.item.geo.lat, $scope.item.geo.lon);

                map.setCenter(newLa);
                window.console.log($scope.item);

            }
        });


    });

}];




