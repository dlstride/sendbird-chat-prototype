//TBD - don't really need right now since all open channels are being pulled down
app2.controller('JoinChannelCtrl', ['$scope', '$rootScope', '$routeParams', '$window', 'sharedDataService',
    function joinChannelController($scope, $rootScope, $routeParams, $window, sharedDataService) {
        $scope.email = "";
        $scope.nickname = "";
        $scope.channels = [];
        $scope.getChannelList = function (page) {
            angular.copy(null, $scope.channels);
            sendbird.getChannelList({
                "page": page,
                "limit": 50,
                "successFunc": function (data) {
                    $scope.$apply(function () {
                        $scope.channels = data.channels;
                    });
                },
                "errorFunc": function (status, error) {
                    console.log(status, error);
                }
            });
        };
        $scope.joinChannel = function (selectedChannel) {
            var a = 0;
        };
        $scope.cancel = function () {
            $window.location = '#/home/' + $scope.email + "/" + $scope.nickname;
        };
        $scope.init = function () {
            $scope.email = $routeParams.email;
            $scope.nickname = $routeParams.nickname;
            $scope.getChannelList(1);
        };
        $scope.init();
    }]);
//# sourceMappingURL=joinchannel.js.map