

/* Services */

var dsServices = angular.module('dsServices', []);


dsServices.factory("GeolocationService", ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
  "use strict";
    window.console.log('GeolocationService  executed');
    return function () {
        var deferred = $q.defer();

        if (!$window.navigator) {
            $rootScope.$apply(function () {
                deferred.reject(new Error("Geolocation is not supported"));
            });
        } else {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                $rootScope.$apply(function () {
                    deferred.resolve(position);
                });
            }, function (error) {
                $rootScope.$apply(function () {
                    deferred.reject(error);
                });
            });
        }

        return deferred.promise;
    };
}]);


dsServices.service('gMapper', ['$rootScope', function ($rootScope) {
  "use strict";

    this.alertCoords = function (lat, lon) {
        window.console.log('Gmapper trigg');
        this.lat = lat;
        this.lng = lon;
        $rootScope.$broadcast("mapUpdated", {lat: lat, lng: lon});

    };
}]);


dsServices.service('DistanceCalculatorService', function () {
  "use strict";

    this.calcCrow = function (a, b) {

        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        };
        Number.prototype.toInt = function () {
            return Math.round(  // round to nearest integer
                Number(this)    // type cast your input
            );
        };
        if (a.latitude === undefined || a.longitude === undefined || b.lat === undefined || b.lon === undefined) {
            return null;
        }
        var lat1, lon1, lat2, lon2;
        lat1 = a.latitude;
        lon1 = a.longitude;
        lat2 = b.lat;
        lon2 = b.lon;
        var R = 6371; // km
        var dLat = (lat2 - lat1).toRad();
        var dLon = (lon2 - lon1).toRad();
        var klat1 = lat1 * Math.PI / 180;
        var klat2 = lat2 * Math.PI / 180;
        var z = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(klat1) * Math.cos(klat2);
        var c = 2 * Math.atan2(Math.sqrt(z), Math.sqrt(1 - z));
        var d = R * c;
        return d.toInt();
    };

});





