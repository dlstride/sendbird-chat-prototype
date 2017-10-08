app2.controller('homeViewCtrl', ['$scope', '$rootScope', '$routeParams', 'sendBirdService',
        function homeViewController($scope, $rootScope, $routeParams, sendBirdService) {

            $scope.guest_id = "";

            $scope.currScrollHeight = 0;

            $scope.directMessageGroup = false;
            $scope.selectedChannelName = "";
            $scope.selectedChannelUrl = "";
            $scope.channelMembers = [];
            $scope.chatDiscussions = [];
            $scope.newMessage = "";

            $scope.moreMessagesToLoad = true;

            $scope.joinChannel = function (channelUrl) {

                if (channelUrl == $scope.selectedChannelUrl) {
                    return false;
                }

                $scope.selectedChannelName = "";
                angular.copy(null, $scope.chatDiscussions);
                $scope.getMemberList(channelUrl);

                sendBirdService.joinChannel(channelUrl)
                       .then(function (data) {

                           var currChannelInfo = data;
                           $scope.selectedChannelName = currChannelInfo['name'];
                           $scope.selectedChannelUrl = currChannelInfo['channel_url'];

                           $scope.connectToSB();
                       },
                      function (error) {
                          console.log(status, error);
                      });

            };

            $scope.buildChannelTitle = function (members) {
                var channelTitle = '';
                $.each(members,
                    function (index, member) {
                        if (!isCurrentUser(member['guest_id'])) {
                            channelTitle += member['name'] + ', ';
                        }
                    });
                channelTitle = channelTitle.slice(0, -2);
                if (channelTitle.length > 24) {
                    channelTitle = channelTitle.substring(0, 22);
                    channelTitle += '... ';
                }
                return channelTitle;
            };

            $scope.joinMessagingChannel = function (channelUrl) {

                if (channelUrl === $scope.selectedChannelUrl) {
                    return false;
                }

                $scope.selectedChannelName = "";
                angular.copy(null, $scope.chatDiscussions);
                $scope.getMemberList(channelUrl);

                sendBirdService.joinMessagingChannel(channelUrl)
                        .then(function (data) {

                            var currChannelInfo = data['channel'];
                            $scope.selectedChannelUrl = currChannelInfo['channel_url'];
                            $scope.selectedChannelName = $scope.buildChannelTitle(data["members"]);

                            $scope.connectToSB();
                        },
                       function (error) {
                           console.log(status, error);
                       });
            };

            $scope.connectToSB = function () {
                sendBirdService.connectSendBird()
                        .then(function () {
                            $scope.loadMoreChatMessage(scrollPositionBottom);
                        },
                       function (error) {
                           console.log(status, error);
                       });
            };


            $scope.addFileOrImageToChat = function (msg) {
                var hasImage = sendBirdService.hasImage(msg);
                $scope.chatDiscussions.push({
                    userName: msg.user.name,
                    date: msg.ts,
                    image: msg.user.image,
                    fileName: msg.name,
                    fileUrl: msg.url,
                    isMessage: false,
                    isFileMessage: !hasImage,
                    isImage: hasImage,
                    isSystemMessage: false
                });
            };

            $scope.loadMoreChats = function () {
                $scope.loadMoreChatMessage(scrollPositionBottom);
            };

            $scope.loadMoreChatMessage = function (func) {

                sendBirdService.loadMoreMessages()
                     .then(function (data) {
                         var moreMessage = data["messages"];

                         $scope.moreMessagesToLoad = moreMessage.length !== 0;

                         if ($scope.moreMessagesToLoad) {
                             $.each(moreMessage,
                                 function (index, msg) {

                                     if (sendBirdService.isMessage(msg)) {

                                         $scope.chatDiscussions.unshift({
                                             userName: msg.payload.user.name,
                                             date: msg.payload.ts,
                                             image: msg.payload.user.image,
                                             message: msg.payload.message,
                                             isMessage: true,
                                             isFileMessage: false,
                                             isImage: false,
                                             isSystemMessage: false
                                         });

                                     } else if (sendBirdService.isFileMessage(msg)) {
                                         $scope.addFileOrImageToChat(msg.payload);
                                     }
                                 });

                             $scope.scrollChatWindow();

                             if (func != undefined) func();
                         }
                     },
                    function (error) {
                        console.log(status, error);
                    });
            }

            $scope.getMemberList = function (channelUrl) {

                angular.copy(null, $scope.channelMembers);

                sendBirdService.getMemberList(channelUrl)
                      .then(function (data) {
                          $scope.channelMembers = data.members;
                      },
                     function (error) {
                         console.log(status, error);
                     });
            };

            $scope.sendNewMessage = function () {
                var message = $.trim($scope.newMessage);
                sendBirdService.sendMessage(message);
                $scope.scrollChatWindow();
                $scope.newMessage = "";
            };

            $scope.setChatMessage = function (obj) {

                $scope.$apply(function () {
                    $scope.chatDiscussions.push({
                        userName: obj.user.name,
                        date: obj.ts,
                        image: obj.user.image,
                        message: obj.message,
                        isMessage: true,
                        isFileMessage: false,
                        isSystemMessage: false
                    });
                });

                $scope.scrollChatWindow();
            };

            $scope.setSystemChatMessage = function (obj) {

                $scope.$apply(function () {
                    $scope.chatDiscussions.push({
                        message: obj.message,
                        isMessage: false,
                        isFileMessage: false,
                        isSystemMessage: true
                    });
                });

                $scope.scrollChatWindow();
            };

            $scope.leaveDmChannel = function () {
                var result = confirm("Are you sure you want to leave this channel?");
                if (result === true) {
                    $rootScope.$emit("notifyLeaveSelectedChannel", $scope.selectedChannelUrl);
                }
            };


            $scope.resetView = function () {
                $scope.directMessageGroup = false;
                $scope.selectedChannelName = "";
                $scope.selectedChannelUrl = "";
                $scope.channelMembers = [];
                $scope.chatDiscussions = [];
                $scope.newMessage = "";
                $scope.moreMessagesToLoad = true;
            };

            var scrollPositionBottom = function () {
                $scope.scrollChatWindow();
            };

            $scope.scrollChatWindow = function () {
                var objDiv = document.getElementById("chat-discussion-div");
                if (objDiv !== null) {
                    objDiv.scrollTop = objDiv.scrollHeight;
                    $('#chat-discussion-div').animate({
                        scrollTop: objDiv.scrollHeight
                    });
                }
            };

            function isCurrentUser(guestId) {
                return ($scope.guest_id == guestId) ? true : false;
            }

            $scope.file_changed = function (element) {

                var file = element.files[0];

                sendBirdService.sendFile(file)
                       .then(function (data) {
                           console.log(data.url);
                       },
                      function (error) {
                          console.log(status, error);
                          alert('file size too large.\nplease select less than 25MB.');
                      });
            };

            $scope.initListeners = function () {
                $rootScope.$on("notifyNavigateToChannel", function (event, channel) {
                    $scope.moreMessagesToLoad = true;
                    $scope.directMessageGroup = false;
                    $scope.joinChannel(channel.channel_url);
                });

                $rootScope.$on("notifyNavigateToDM", function (event, dm) {
                    $scope.moreMessagesToLoad = true;
                    $scope.directMessageGroup = true;
                    $scope.joinMessagingChannel(dm.channel.channel.channel_url);
                });

                $rootScope.$on("notifySendBirdOnMessageReceived", function (event, obj) {
                    $scope.setChatMessage(obj);
                });

                $rootScope.$on("notifySendBirdOnSystemMessageReceived", function (event, obj) {
                    $scope.setSystemChatMessage(obj);
                });

                $rootScope.$on("notifyResetView", function (event, obj) {
                    $scope.resetView();
                });

                $rootScope.$on("notifySendBirdOnFileMessageReceived", function (event, obj) {
                    $scope.$apply(function () {
                        $scope.addFileOrImageToChat(obj);
                    });
                    $scope.scrollChatWindow();
                });

            };

            $scope.init = function () {

                $scope.initListeners();

                var email = $routeParams.email;
                var nickname = $routeParams.nickname;
                $scope.guest_id = email;
                if ($scope.guest_id.length > 0) {
                    $rootScope.$emit("setGuestId", email, nickname);
                }

            };
            $scope.init();
        }]);