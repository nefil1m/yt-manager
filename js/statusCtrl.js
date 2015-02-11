app.controller('statusCtrl', ['$scope', 'channel', function($scope, channel) {

    $scope.$watch(function() { return channel.simplified }, function() {
        $scope.data = channel.simplified;
    }, true);

    $scope.play = function() {
        channel.simplified.playState = 'playing';
        channel.player.playVideo();
    };

    $scope.stop = function() {
        channel.simplified.playState = 'stopped';
        channel.player.stopVideo();
    };

    $scope.pause = function() {
        channel.simplified.playState = 'paused';
        channel.player.pauseVideo();
    }
}]);