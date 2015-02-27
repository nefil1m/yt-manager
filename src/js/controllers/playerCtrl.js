app.controller('playerCtrl', ['$scope', 'channel', function($scope, channel) {
  $scope.init = function() {
    $(window).load(function() {
      channel.player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'o3mP3mJDL2k',
        events: {
          'onStateChange': 'emitStateChange'
        }
      });
    });
  };
}]);