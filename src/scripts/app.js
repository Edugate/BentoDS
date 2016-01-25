/* Discovery Service part */

var dsApp = angular.module('dsApp', [ // jshint ignore:line
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

dsApp.constant('config', {
    srcDataApp: '@@srcdataapp',
    srcIdPList: '@@srcidplist',
    srcRequesterInfo: '@@srcrequesterinfo',
    srcIdPListFallback: '@@srcidplistfallback',
    srcDataAppFallback: '@@srcdataappfallback'
});

dsApp.config(['$locationProvider', '$routeProvider',
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




