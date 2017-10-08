app2.controller('JoinDMCtrl', ['$scope', '$rootScope', '$routeParams', '$window', 'sharedDataService', 'sendBirdService',
    function joinDMController($scope, $rootScope, $routeParams, $window, sharedDataService, sendBirdService) {
        $scope.email = "";
        $scope.nickname = "";
        $scope.chatUsers = [];
        $scope.getUserList = function (options) {
            options = $.extend({}, { "page": 1, "token": '', "limit": 30 }, options);
            angular.copy(null, $scope.chatUsers);
            sendBirdService.getUserList()
                .then(function (data) {
                $scope.userListToken = data["token"];
                $scope.userListNext = data["next"];
                var users = data["users"];
                for (var i = 0; i < users.length; i++) {
                    $scope.chatUsers.push({
                        email: users[i].guest_id,
                        name: users[i].nickname,
                        avatar: users[i].picture,
                        isOnline: users[i].is_online,
                        isSelected: false
                    });
                }
            }, function (error) {
                console.log(status, error);
            });
        };
        $scope.toggleSelected = function (selectedUser) {
            selectedUser.isSelected = !selectedUser.isSelected;
        };
        $scope.cancel = function () {
            $scope.navigateToHome();
        };
        $scope.navigateToHome = function () {
            $window.location = '#/home/' + $scope.email + "/" + $scope.nickname;
        };
        $scope.createChannel = function () {
            var selectedUsers = [];
            for (var i = 0; i < $scope.chatUsers.length; i++) {
                if ($scope.chatUsers[i].isSelected) {
                    selectedUsers.push($scope.chatUsers[i].email);
                }
            }
            if (selectedUsers.length === 0) {
                alert("please select a user");
                return;
            }
            $scope.sendBirdStartMessaging(selectedUsers);
        };
        $scope.sendBirdStartMessaging = function (guestIds) {
            sendbird.startMessaging(guestIds, {
                "successFunc": function (data) {
                    sharedDataService.setSelectedChannel(data.channel.channel_url);
                    $rootScope.$emit("notifyDMChannelJoined", data);
                    $scope.navigateToHome();
                },
                "errorFunc": function (status, error) {
                    console.log(status, error);
                }
            });
        };
        $scope.init = function () {
            $scope.email = $routeParams.email;
            $scope.nickname = $routeParams.nickname;
            $scope.getUserList();
        };
        $scope.init();
    }]);
//# sourceMappingURL=joindm.js.map