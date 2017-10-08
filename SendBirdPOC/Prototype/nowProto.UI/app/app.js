var app;
(function (app) {
    var main = angular.module("nowproto", ["ngRoute", "common.services"]);
    main.config(routeConfig);
    routeConfig.$inject = ["$routeProvider", "$locationProvider"];
    function routeConfig($routeProvider, $locationProvider) {
        $routeProvider
            .when('/login', {
            templateUrl: 'app/login/sendbirdlogin.html',
            controller: 'SendBirdLoginCtrl as vm'
        })
            .when('/home/:email/:nickname', {
            templateUrl: 'app/main/homeview.html',
            controller: 'homeViewCtrl as vm'
        })
            .when('/channel/:email/:nickname', {
            templateUrl: 'app/join/joinchannel.html',
            controller: 'JoinChannelCtrl as vm'
        })
            .when('/dm/:email/:nickname', {
            templateUrl: 'app/join/joindm.html',
            controller: 'JoinDMCtrl as vm'
        })
            .otherwise('/login');
    }
})(app || (app = {}));
//# sourceMappingURL=app.js.map