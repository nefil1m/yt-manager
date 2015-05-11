angular.module('YTPlaylistManager')
.controller('videosCtrl', ['$scope', 'channel', '$stateParams', '$location',
  function($scope, channel, $stateParams, $location) {
    $scope.options = channel.options;

    if( angular.isDefined(channel.playlists) ) {
      for(var i in channel.playlists) {
        if(channel.playlists[i].id === $stateParams.id) {
          $scope.videos = channel.playlists[i].videos;
          var from = $scope.options.maxResults * ($scope.currentPage - 1);
          $scope.filteredVideos = $scope.videos.slice(from, from + $scope.options.maxResults);
        }
      }
    } else {
      $location.url('/playlists');
    }
  }]);