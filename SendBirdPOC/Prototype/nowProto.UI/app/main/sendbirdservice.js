var app;
(function (app) {
    var common;
    (function (common) {
        var SendBirdService = (function () {
            function SendBirdService($q, $rootScope) {
                this.$q = $q;
                //TODO - update appId for client
                this.appId = 'X-X-X-X-X';
                this.$rootScope = $rootScope;
            }
            SendBirdService.prototype.getChannelList = function (page) {
                var deferred = this.$q.defer();
                sendbird.getChannelList({
                    "page": page,
                    "limit": 20,
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.getMessagingChannelList = function () {
                var deferred = this.$q.defer();
                sendbird.getMessagingChannelList({
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.getMemberList = function (channelUrl) {
                var deferred = this.$q.defer();
                sendbird.getMemberList(channelUrl, {
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.getUserList = function () {
                var deferred = this.$q.defer();
                //        var options = $.extend({}, { "page": 1, "token": '', "limit": 30 }, options);
                var options = $.extend({}, { "page": 1, "token": '', "limit": 30 });
                sendbird.getUserList({
                    "token": options["token"],
                    "page": options["page"],
                    "limit": options["limit"],
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.joinChannel = function (channelUrl) {
                var deferred = this.$q.defer();
                sendbird.joinChannel(channelUrl, {
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.joinMessagingChannel = function (channelUrl) {
                var deferred = this.$q.defer();
                sendbird.joinMessagingChannel(channelUrl, {
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.leaveMessagingChannel = function (channelUrl) {
                var deferred = this.$q.defer();
                sendbird.endMessaging(channelUrl, {
                    "successFunc": function (data) {
                        deferred.resolve(data);
                        //                     sendbird.disconnect();
                        //                     sendbird.connect();
                    },
                    "errorFunc": function (status, error) {
                        console.log(status, error);
                        deferred.reject(error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.loadMoreMessages = function () {
                var deferred = this.$q.defer();
                sendbird.getMessageLoadMore({
                    "limit": 10,
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.markAsRead = function (dm) {
                sendbird.markAsRead(dm.channel.channel.channel_url);
            };
            SendBirdService.prototype.sendFile = function (file) {
                var deferred = this.$q.defer();
                sendbird.sendFile(file, {
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.sendMessage = function (message) {
                sendbird.message(message);
            };
            SendBirdService.prototype.hasImage = function (message) {
                return sendbird.hasImage(message);
            };
            SendBirdService.prototype.isFileMessage = function (message) {
                return sendbird.isFileMessage(message.cmd);
            };
            SendBirdService.prototype.isGroupMessaging = function (channel) {
                return sendbird.isGroupMessaging(channel["channel_type"]);
            };
            SendBirdService.prototype.isMessage = function (message) {
                return sendbird.isMessage(message.cmd);
            };
            SendBirdService.prototype.connectSendBird = function () {
                var deferred = this.$q.defer();
                sendbird.connect({
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.disconnectSendBird = function () {
                var deferred = this.$q.defer();
                sendbird.disconnect({
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                });
                return deferred.promise;
            };
            SendBirdService.prototype.startSendBird = function (guestId, nickName) {
                var rootScope = this.$rootScope;
                sendbird.init({
                    "app_id": this.appId,
                    "guest_id": guestId,
                    "user_name": nickName,
                    "image_url": '',
                    "access_token": '',
                    "successFunc": function (data) {
                        sendbird.connect();
                        rootScope.$emit("notifySendBirdConnected");
                    },
                    "errorFunc": function (status, error) {
                        console.log(status, error);
                    }
                });
                sendbird.events.onMessageReceived = function (obj) {
                    rootScope.$emit("notifySendBirdOnMessageReceived", obj);
                };
                sendbird.events.onSystemMessageReceived = function (obj) {
                    var b = 0;
                };
                sendbird.events.onMessageDelivery = function (obj) {
                    console.log(obj);
                };
                sendbird.events.onMessagingChannelUpdateReceived = function (obj) {
                    rootScope.$emit("notifySendBirdOnMessagingChannelUpdateReceived", obj);
                };
                sendbird.events.onSystemMessageReceived = function (obj) {
                    rootScope.$emit("notifySendBirdOnSystemMessageReceived", obj);
                };
                sendbird.events.onFileMessageReceived = function (obj) {
                    rootScope.$emit("notifySendBirdOnFileMessageReceived", obj);
                };
            };
            return SendBirdService;
        }());
        SendBirdService.inject = ['$rootScope'];
        common.SendBirdService = SendBirdService;
        angular
            .module("common.services")
            .service("sendBirdService", SendBirdService);
    })(common = app.common || (app.common = {}));
})(app || (app = {}));
//# sourceMappingURL=sendbirdservice.js.map