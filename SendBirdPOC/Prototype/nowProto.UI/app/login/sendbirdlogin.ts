module app.sendBirdLogin {

    interface ISendBirdLogingModel {
        email: string;
        nickname: string;

        navigateToChannels(): void;
    }

    class SendBirdLoginCtrl implements ISendBirdLogingModel {

        email: string;
        nickname: string;

        constructor(public $scope: ISendBirdLogingModel) {
            this.email = "";
            this.nickname = "";
        }

        navigateToChannels = function () {

            if (this.email.length === 0 || this.nickname.length === 0) {
                alert('Please enter both an email address and nickname.');
                return;
            }

            window.location.href = '#/home/' + this.email + "/" + this.nickname;
        };
    }

    //Register the above controller with the angular module 'nowproto'
    angular
        .module('nowproto')
        .controller("SendBirdLoginCtrl", SendBirdLoginCtrl);
}