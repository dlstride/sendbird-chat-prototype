app2.factory("sharedDataService", function ($http, $q, $rootScope) {

    var selectedChannelUrl = "";

    var service = {
        getSelectedChannel: _getSelectedChannel,
        setSelectedChannel: _setSelectedChannel
    };


    return service;

    function _getSelectedChannel() {

        return selectedChannelUrl;
    };

    function _setSelectedChannel(channelUrl) {
        selectedChannelUrl = channelUrl;
    }
});