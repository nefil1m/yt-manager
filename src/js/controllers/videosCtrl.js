angular.module('YTPlaylistManager')
.controller('videosCtrl', ['$rootScope', '$scope', 'channel', '$stateParams', '$location', 'YTResourceProvider',
  function($rootScope, $scope, channel, $stateParams, $location, YTResourceProvider) {
    $scope.options = channel.options;

    if(angular.isDefined(channel.playlists)) {
      $scope.videos = $rootScope.openedPlaylist.videos;
      var from = $scope.options.maxResults * ($scope.currentPage - 1);
      $scope.filteredVideos = $scope.videos.slice(from, from + $scope.options.maxResults);
    } else {
      $location.url('/playlists');
    }

    $scope.playVideo = function(index) {
      channel.activePlaylist = $rootScope.openedPlaylist;
      channel.player.loadVideoById(channel.activePlaylist.videos[index].id);
      channel.activeVideo = index;
    };

    $scope.deleteVideo = function(index) {
      var options = {
        id: $rootScope.openedPlaylist.videos[index].id
      };

      YTResourceProvider.sendRequest(options, 'playlistItems.delete')
        .then(function(response) {
          $scope.$parent.success('Deleted');
          $rootScope.openedPlaylist.videos.splice(index, 1);
        }, function(response) {
          console.log(response);
        });
    };

    var moveAtPosition = function(pos, video) {
        var options = {
        id: video.playlistItemId,
        part: 'snippet',
        snippet: {
          playlistId: $rootScope.openedPlaylist.id,
          resourceId: video.id,
          position: pos
        }
      };

      YTResourceProvider.sendRequest(options, 'playlistItems.update')
        .then(function(response) {
          console.log(response)
        }, function(response) {
          console.log(response)
        });
    };

    $scope.moveFirst = function(index) {
      moveAtPosition(1, $rootScope.openedPlaylist.videos[index]);
    };

    $scope.moveUp = function(index) {

    };

    $scope.moveDown = function(index) {

    };

    $scope.moveLast = function(index) {

    };

    $scope.likeVideo = function(index) {

    };

    $scope.dislikeVideo = function(index) {

    };
  }]);