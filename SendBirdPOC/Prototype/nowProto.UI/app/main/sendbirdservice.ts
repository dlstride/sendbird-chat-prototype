module app.common {

    interface ISendBirdService {

        getChannelList(page: any): ng.IPromise<{}>;
        getMessagingChannelList(): any;
        getMemberList(channelUrl): any;
        getUserList(): any;
        joinChannel(channelUrl: string): any;
        joinMessagingChannel(channelUrl: string): any;
        leaveMessagingChannel(channelUrl: string): any
        loadMoreMessages(): any;
        markAsRead(dm: any): any;
        sendFile(file: any): any;
        sendMessage(message: string): any;
        hasImage(message: string): any;
        isFileMessage(message: string): any;
        isGroupMessaging(channel: any): any;
        isMessage(message: string): any;
        connectSendBird(): any;
        disconnectSendBird(): any;
        startSendBird(guestId: string, nickName: string): any
    }

    export class SendBirdService implements ISendBirdService {

        //TODO - update appId for client
        appId: string = 'X-X-X-X-X';
        $rootScope: ng.IRootScopeService;


        static inject = ['$rootScope'];

        constructor(private $q: ng.IQService, $rootScope: ng.IRootScopeService) {
            this.$rootScope = $rootScope;
        }

        getChannelList(page: any): ng.IPromise<{}>{

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
        }

        getMessagingChannelList(): any {

            var deferred = this.$q.defer();

            sendbird.getMessagingChannelList({
                "successFunc": function (data) {
                    deferred.resolve(data);
                },
                "errorFunc": function (status, error) {
                    deferred.reject(error);
                    console.log(status, error);
                }
                }
            );

            return deferred.promise;
        }

        getMemberList(channelUrl): any {

            var deferred = this.$q.defer();

            sendbird.getMemberList(
                channelUrl,
                {
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                }
            );

            return deferred.promise;
        }

        getUserList(): any {

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
        }

        joinChannel(channelUrl: string): any {

            var deferred = this.$q.defer();

            sendbird.joinChannel(
                channelUrl,
                {
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                }
            );


            return deferred.promise;
        }

        joinMessagingChannel(channelUrl: string): any {
            var deferred = this.$q.defer();

            sendbird.joinMessagingChannel(
                channelUrl,
                {
                    "successFunc": function (data) {

                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                }
            );


            return deferred.promise;
        }

        leaveMessagingChannel(channelUrl: string): any {

            var deferred = this.$q.defer();

            sendbird.endMessaging(
                channelUrl,
                {
                    "successFunc": function (data) {

                        deferred.resolve(data);
                        //                     sendbird.disconnect();
                        //                     sendbird.connect();
                    },
                    "errorFunc": function (status, error) {
                        console.log(status, error);
                        deferred.reject(error);
                    }
                }
            );
            return deferred.promise;
        }

        loadMoreMessages(): any {

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
        }

        markAsRead(dm: any): any {
            sendbird.markAsRead(dm.channel.channel.channel_url);
        }

        sendFile(file:any): any {

            var deferred = this.$q.defer();

            sendbird.sendFile(
                file,
                {
                    "successFunc": function (data) {
                        deferred.resolve(data);
                    },
                    "errorFunc": function (status, error) {
                        deferred.reject(error);
                        console.log(status, error);
                    }
                }
            );

            return deferred.promise;

        }

        sendMessage(message: string): any {
            sendbird.message(message);
        }

        hasImage(message: string): any {
            return sendbird.hasImage(message);
        }

        isFileMessage(message: any): any {
            return sendbird.isFileMessage(message.cmd);
        }

        isGroupMessaging(channel: any): any {
            return sendbird.isGroupMessaging(channel["channel_type"]);
        }

        isMessage(message: any): any {
            return sendbird.isMessage(message.cmd);
        }

        connectSendBird(): any {

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
        }

        disconnectSendBird(): any {

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
        }


        startSendBird(guestId: string, nickName:string): any {

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
        }
    }


    angular
        .module("common.services")
        .service("sendBirdService",
                    SendBirdService);
}