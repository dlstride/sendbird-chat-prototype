var app;
(function (app) {
    var sendBirdLogin;
    (function (sendBirdLogin) {
        var SendBirdLoginCtrl = (function () {
            function SendBirdLoginCtrl($scope) {
                this.$scope = $scope;
                this.navigateToChannels = function () {
                    if (this.email.length === 0 || this.nickname.length === 0) {
                        alert('Please enter both an email address and nickname.');
                        return;
                    }
                    window.location.href = '#/home/' + this.email + "/" + this.nickname;
                };
                this.email = "";
                this.nickname = "";
            }
            return SendBirdLoginCtrl;
        }());
        //Register the above controller with the angular module 'nowproto'
        angular
            .module('nowproto')
            .controller("SendBirdLoginCtrl", SendBirdLoginCtrl);
    })(sendBirdLogin = app.sendBirdLogin || (app.sendBirdLogin = {}));
})(app || (app = {}));
//# sourceMappingURL=sendbirdlogin.js.map