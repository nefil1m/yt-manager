app.controller('statusCtrl', ['$rootScope', '$scope', 'channel', function($rootScope, $scope, channel) {

    $scope.$watch(function() { return channel.simplified }, function() {
        $scope.data = channel.simplified;
    }, true);

    $scope.prevVideo = function() {
        $rootScope.$emit('playPrevious');
    };

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
    };

    $scope.nextVideo = function() {
        $rootScope.$emit('playNext');
    };
}]);