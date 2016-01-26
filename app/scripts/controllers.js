var dsControllers = angular.module('dsControllers', []);

dsControllers.controller('ProviderListCtrl', ['config', '$scope', 'ipCookie', '$location', '$base64', '$http', 'GeolocationService', 'DistanceCalculatorService', 'gMapper', '$uibModal', function (config, $scope, ipCookie, $location, $base64, $http, geolocation, DistanceCalculatorService, gMapper, $uibModal) {
    "use strict";
    $scope.errormessage = null;
    var params = $location.search();
    if (params.entityID === null || params.entityID === undefined || params.entityID === '') {
        window.console.log('params.entityID does not exist');
        $scope.loadingList = false;
        $scope.errormessage = 'Requester\'s entityID has not been provided';
        return false;
    }

 window.console.log('params.entityID  is:"'+params.entityID+'"');
    var pentityid = params.entityID;
    var preturn = params.return;
    var returnidparam = params.returnIDParam;
    $scope.returnidparam = params.returnIDParam;
    if ($scope.returnidparam === undefined || $scope.returnidparam === null || $scope.returnidparam === '') {
        $scope.returnidparam = 'entityID';
    }
    $scope.returnparam = params.return;
    $scope.serviceEntity = params.entityID;

    $scope.position = null;

    geolocation().then(function (position) {
        $scope.position = position;
    }, function (reason) {
        $scope.message = "Could not be determined.";
    });
    var msg;
    if (pentityid === undefined) {
        msg = 'missing entityID param';

    }
    else {
        msg = pentityid;

    }

    var encodedEntityid = $base64.encode(pentityid);
    encodedEntityid = encodedEntityid.replace(/\+/g, '-');
    encodedEntityid = encodedEntityid.replace(/\//g, '_');
    encodedEntityid = encodedEntityid.replace(/\=/g, '~');
    $scope.lastSelected = ipCookie('dslastsel');
    $scope.prevlastSelected = ipCookie('dsprevlastsel');

    $scope.SP = null;

    if (config.srcRequesterInfo !== '') {
        var urlSrcSP = config.srcRequesterInfo + encodedEntityid + '';
        $http.get(urlSrcSP).success(function (data) {
            if (data) {
                if (data.title !== undefined) {
                    $scope.SP = data.title;
                    window.console.log('scope.SP = ' + $scope.SP);
                }
                else {
                    $scope.SP = 'dd';
                    window.console.log('scope.SP = dd');
                }
                if (data.icon !== undefined) {
                    $scope.SPLOGO = data.icon;
                }
            }
        }).error(function () {

            window.console.log('SP ERRR');
        });

    }
    var urlSrc = config.srcIdPList + encodedEntityid + '/metadata.json';
    var urlSrcFallback = config.srcIdPListFallback;
    $scope.loadingList = true;
    $http.get(urlSrc).then(function (response) {
            $scope.mdata = response.data;
            window.console.log('DOWNLOADED');
            if (angular.isArray($scope.mdata)) {

                if (($scope.position !== null) || ($scope.lastSelected !== null)) {
                    angular.forEach($scope.mdata, function (value, key) {
                        value.pr = 0;

                        if ($scope.position !== null && value.geo !== undefined) {
                            value.distance = DistanceCalculatorService.calcCrow($scope.position.coords, value.geo);
                        }
                        if (value.entityID === $scope.prevlastSelected) {
                            value.pr = value.pr - 100;
                        }
                        else if (value.entityID === $scope.lastSelected) {
                            window.console.log('ENTITYID ' + value.entityID);
                            value.pr = value.pr - 200;
                        }

                        window.console.log('PR: ' + value.pr);

                    });
                }
            }

            $scope.loadingList = false;
            $scope.idpList = response.data;

        },
        function () {
            window.console.log('json errr');
            $scope.loadingList = false;

            if (urlSrcFallback !== undefined && urlSrcFallback !== null) {
                $scope.errormessage = 'Could not load the list of Identity Providers. Trying to load backup...';
                $http.get(urlSrcFallback).then(function (response) {
                    $scope.mdata = response.data;
                    if (angular.isArray($scope.mdata)) {

                        if (($scope.position !== null) || ($scope.lastSelected !== null)) {
                            angular.forEach($scope.mdata, function (value, key) {
                                value.pr = 0;

                                if ($scope.position !== null && value.geo !== undefined) {
                                    value.distance = DistanceCalculatorService.calcCrow($scope.position.coords, value.geo);
                                }
                                if (value.entityID === $scope.prevlastSelected) {
                                    value.pr = value.pr - 100;
                                }
                                else if (value.entityID === $scope.lastSelected) {
                                    window.console.log('ENTITYID ' + value.entityID);
                                    value.pr = value.pr - 200;
                                }

                                window.console.log('PR: ' + value.pr);

                            });
                        }
                    }
                    $scope.loadingList = false;
                    $scope.idpList = response.data;
                    $scope.errormessage = null;
                    window.console.log('D  SUCCES');
                }, function () {
                    window.console.log('S  FAIL');
                });

            }
            else {
                $scope.errormessage = 'Could not load the list of Identity Providers';
            }


        }
    );

    $scope.$watch("position", function (newValue, oldValue) {
        if (oldValue === null && newValue !== null) {
            window.console.log('POSITION UPDATED');
            angular.forEach($scope.mdata, function (value, key) {

                if (value.geo !== undefined) {
                    value.distance = DistanceCalculatorService.calcCrow($scope.position.coords, value.geo);
                }
            });
        }


    });

    $scope.updatelast = function (v) {

        window.console.log(' previus select' + $scope.lastSelected);
        ipCookie('dsprevlastsel', $scope.lastSelected, {expires: 21});
        ipCookie('dslastsel', v, {expires: 21});
    };
    $scope.showOnMap = function (v) {
        window.console.log('show on map clicked ' + v.lat + ', ' + v.lon);
        gMapper.alertCoords(v.lat, v.lon);

    };

    $scope.showModal = function (a, b, c) {


        $scope.opts = {
            size: 'md',
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            resolve: {} // empty storage

        };


        $scope.opts.resolve.item = function () {

            return angular.copy({title: a, name: b, geo: c});
        };

        var uibModalInstance = $uibModal.open($scope.opts);

        $scope.readyForMap = true;

        uibModalInstance.result.then(function () {

            //on ok button press
        }, function () {
            //on cancel button press
            window.console.log("Modal Closed");
        });

    };

}]);

dsControllers.controller('Nav', function ($scope) {
});

