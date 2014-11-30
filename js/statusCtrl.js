app.controller('statusCtrl', ['$scope', 'channelData', function($scope, channelData) {

    $scope.$watch(function() { return channelData.simplified }, function() {
        $scope.data = channelData.simplified;
    }, true);

    $scope.play = function() {
        channelData.simplified.playState = 'playing';
        channelData.player.playVideo();
    };

    $scope.stop = function() {
        channelData.simplified.playState = 'stopped';
        channelData.player.stopVideo();
    };

    $scope.pause = function() {
        channelData.simplified.playState = 'paused';
        channelData.player.pauseVideo();
    }
}]);