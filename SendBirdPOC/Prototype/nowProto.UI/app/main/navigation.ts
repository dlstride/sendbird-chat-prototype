var app2 = angular.module('nowproto')
    .value('$', $);

    //TBD remove
    declare var sendbird: any

    app2.controller('navigationController', ['$scope', '$rootScope', 'sendBirdService', 'sharedDataService',
    function ($scope, $rootScope, sendBirdService, sharedDataService) {

        $scope.guest_id = "";
        $scope.nickname = "";

        $scope.channels = [];
        $scope.directMessageList = [];
        $scope.chatUsers = [];

        $scope.selectedUrl = "";

        $scope.userListToken = '';
        $scope.userListNext = 0;


        $scope.getUserList = function (options) {

            angular.copy(null, $scope.chatUsers);

            sendBirdService.getUserList()
                         .then(function (data) {

                             $scope.userListToken = data["token"];
                             $scope.userListNext = data["next"];
                             var users = data["users"];

                             for (var i = 0; i < users.length; i++) {
                                 $scope.chatUsers.push({
                                     name: users[i].nickname,
                                     avatar: users[i].picture,
                                     isOnline: users[i].is_online
                                 });
                             }

                         },
                         function (error) {
                            console.log(status, error);
                        });

        };



        function isCurrentUser(guestId) {
            return ($scope.guest_id == guestId) ? true : false;
        }

        $scope.getChannelList = function (page) {

            angular.copy(null, $scope.channels);

            sendBirdService.getChannelList()
                      .then(function (data) {
                          $scope.channels = data.channels;
                      },
                     function (error) {
                         console.log(status, error);
                     });
        };

        $scope.getDirectMessagingList = function () {

            angular.copy(null, $scope.directMessageList);

            sendBirdService.getMessagingChannelList()
                 .then(function (data) {
                     $.each(data['channels'],
                             function (index, channel) {
                                 $scope.addNewDirectMessage(channel);

                                 //TODO
                                 //                    addMessagingChannel(groupCheck, channelMemberList, channel["channel"]);
                                 //    $.each($('.left-nav-channel'), function (index, item) {
                                 //        $(item).removeClass('left-nav-channel-messaging--active');
                                 //        $(item).removeClass('left-nav-channel-group--active');
                                 //    });
                                 //    var targetUrl = channel["channel"]["channel_url"];
                                 //    var unread = channel['unread_message_count'];
                                 //    if (unread != 0) {
                                 //        $.each($('.left-nav-channel'), function (index, item) {
                                 //            if ($(item).data("channel-url") == targetUrl) {
                                 //                addUnreadCount(item, unread, targetUrl);
                                 //            }
                                 //        });
                                 //    }
                             });
                 },
              function (error) {
                  console.log(status, error);
              });
        };

        $scope.addNewDirectMessage = function (channel) {

            var channelMemberList = '';

            $.each(channel["members"], function (index, member) {
                if (!isCurrentUser(member['guest_id'])) {
                    channelMemberList += member['name'] + ', ';
                }
            });

            channelMemberList = channelMemberList.slice(0, -2);

            if (channelMemberList.length > 9) {
                channelMemberList = channelMemberList.substring(0, 9) + '...';
            }

            var groupCheck = sendBirdService.isGroupMessaging(channel);

            var dmChannel = {
                channel: channel,
                members: channelMemberList
            };

            var unread = channel.unread_message_count;
            $scope.updateUnreadCountForDMChannel(dmChannel, unread);

            $scope.directMessageList.push(dmChannel);

        };

        $scope.leaveDmChannel = function (channel) {

            sendBirdService.leaveMessagingChannel(channel)
                .then(function (data) {
                    $scope.disconnectSB(true);
                    $scope.removeDMFromList($scope.selectedUrl);
                    $scope.selectedUrl = "";
                    $rootScope.$emit("notifyResetView");
                },
                function (error) {
                    console.log(status, error);
                });
        };

        $scope.removeDMFromList = function (selectedUrl) {
            for (var i = 0; i < $scope.directMessageList.length; i++) {
                if ($scope.directMessageList[i].channel.channel.channel_url === selectedUrl) {
                    $scope.directMessageList.splice(i, 1);
                    break;
                }
            }
        };

        $scope.connectSB = function () {

            sendBirdService.connect()
                .then(function (data) {
                },
                function (error) {
                    console.log(status, error);
                });

        };

        $scope.disconnectSB = function (reconnect) {
            sendBirdService.disconnectSendBird()
                .then(function (data) {
                    if (reconnect) {
                        $scope.connectSB();
                    }
                },
               function (error) {
                   console.log(status, error);
               });
        };

        $scope.navigateToChannel = function (channel) {
            $rootScope.$emit("notifyNavigateToChannel", channel);
            $scope.selectedUrl = channel.channel_url;
        };

        $scope.navigateToDM = function (dm) {
            $rootScope.$emit("notifyNavigateToDM", dm);
            $scope.selectedUrl = dm.channel.channel.channel_url;
        };

        $scope.findDMChannel = function (url) {
            for (var i = 0; i < $scope.directMessageList.length; i++) {
                if ($scope.directMessageList[i].channel.channel.channel_url === url) {
                    return $scope.directMessageList[i];
                }
            }
            return null;
        }

        $scope.updateUnReadCount = function (data) {

            var targetUrl = data['channel']['channel_url'];
            var dmChannel = $scope.findDMChannel(targetUrl);
            $scope.$apply(function () {
                $scope.updateUnreadCountForDMChannel(dmChannel, data['unread_message_count']);
            });
        };

        $scope.markAsRead = function (dm) {
            sendBirdService.markAsRead(dm);
            dm.channel.unread_message_count = 0;
        };

        $scope.updateUnreadCountForDMChannel = function (dmChannel, unread) {
            unread = unread > 9 ? '9+' : unread;
            if (unread > 0 || unread === '9+') {
                if (!document.hasFocus()) {
                    dmChannel.channel.unread_message_count = unread;
                }
            }
        }

        $scope.navigateToSetChannel = function () {
            var url = sharedDataService.getSelectedChannel();
            if ($scope.selectedUrl !== url) {
                var dmChannel = $scope.findDMChannel(url);
                $scope.navigateToDM(dmChannel);
            }
        };

        $scope.initListeners = function () {

            $rootScope.$on("notifySendBirdConnected",
                function (e) {
                    $scope.getChannelList(1);
                    $scope.getDirectMessagingList();

                    $scope.getUserList({ "token": $scope.userListToken, "page": 1, "limit": 30 });

                });

            $rootScope.$on("notifySendBirdOnMessagingChannelUpdateReceived",
                function (e, data) {
                    $scope.updateUnReadCount(data);
                });

            $rootScope.$on("notifyDMChannelJoined", function (e, data) {
                $scope.$apply(function () {
                    var exists = $scope.findDMChannel(data.channel.channel_url) != null;
                    if (!exists) {
                        $scope.addNewDirectMessage(data);
                    }
                    $scope.navigateToSetChannel();
                });
            });

            $rootScope.$on("notifyResetSelectedChannel", function (event) {
                $scope.$apply(function () {
                    $scope.resetView();
                });
            });


            $rootScope.$on("notifyLeaveSelectedChannel", function (event, channel) {
                $scope.leaveDmChannel(channel);
            });

            $rootScope.$on("setGuestId", function (event, username, nickname) {

                $scope.guest_id = username;
                $scope.nickname = nickname;

                sendBirdService.startSendBird($scope.guest_id, $scope.nickname);
            });

        };

        $scope.init = function () {

            $scope.initListeners();

            $scope.navigateToSetChannel();
        };

        $scope.init();

    }]);