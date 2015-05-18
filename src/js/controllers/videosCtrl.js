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
        id: $rootScope.openedPlaylist.videos[index].playlistItemId
      };

      YTResourceProvider.sendRequest(options, 'playlistItems.delete')
        .then(function(response) {
          $scope.$parent.success('Deleted');
          $rootScope.openedPlaylist.videos.splice(index, 1);
        }, function(response) {
          console.log(response);
        });
    };

    var moveAtPosition = function(data) {
        var options = {
        id: data.video.playlistItemId,
        part: 'snippet',
        snippet: {
          playlistId: $rootScope.openedPlaylist.id,
          resourceId: {
            kind: 'youtube#video',
            videoId: data.video.id
          },
          position: data.desiredPosition
        }
      };

      YTResourceProvider.sendRequest(options, 'playlistItems.update')
        .then(function(response) {
          var video = $rootScope.openedPlaylist.videos.splice(data.itemIndex, 1);
          $rootScope.openedPlaylist.videos.splice(data.desiredPosition, 0, data.video);
        }, function(response) {
          console.log(response)
        });
    };

    $scope.moveFirst = function(index) {
      moveAtPosition({
        desiredPosition: 0,
        itemIndex: index,
        video: $rootScope.openedPlaylist.videos[index]
      });
    };

    $scope.moveUp = function(index) {
      moveAtPosition({
        desiredPosition: index - 1,
        itemIndex: index,
        video: $rootScope.openedPlaylist.videos[index]
      });
    };

    $scope.moveDown = function(index) {
      moveAtPosition({
        desiredPosition: index + 1,
        itemIndex: index,
        video: $rootScope.openedPlaylist.videos[index]
      });
    };

    $scope.moveLast = function(index) {
      console.log($rootScope.openedPlaylist)
      moveAtPosition({
        desiredPosition: $rootScope.openedPlaylist.contentDetails.itemCount - 1,
        itemIndex: index,
        video: $rootScope.openedPlaylist.videos[index]
      });
    };

    $scope.likeVideo = function(index) {

    };

    $scope.dislikeVideo = function(index) {

    };
  }]);