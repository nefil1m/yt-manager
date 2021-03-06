angular.module('YTPlaylistManager')
.controller('playerCtrl', ['$scope', 'channel', function($scope, channel) {

  var nextPrevVideo = function(index) {
    $scope.prevVideo = channel.activePlaylist.videos[--index];
    $scope.nextVideo = channel.activePlaylist.videos[index + 2];
  };

  var stateChange = function(e) {
    if( channel.options.autoplay && e.data == 0 ) {
      channel.activeVideo++;
      channel.player.loadVideoById(channel.activePlaylist.videos[channel.activeVideo].id);
      nextPrevVideo(channel.activeVideo);
      $scope.$apply();
    }
    if( e.data == 1 ) {
      nextPrevVideo(channel.activeVideo);
      $scope.$apply();
    }
  };

  $scope.playPreviousVideo = function() {
    channel.activeVideo--;
    channel.player.loadVideoById(channel.activePlaylist.videos[channel.activeVideo].id);
    nextPrevVideo(channel.activeVideo);
  };

  $scope.playNextVideo = function() {
    channel.activeVideo++;
    channel.player.loadVideoById(channel.activePlaylist.videos[channel.activeVideo].id);
    nextPrevVideo(channel.activeVideo);
  };

  $scope.init = function() {
    $(window).load(function() {
      channel.player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'o3mP3mJDL2k',
        events: {
          'onStateChange': stateChange
        }
      });
    });
  };

}]);