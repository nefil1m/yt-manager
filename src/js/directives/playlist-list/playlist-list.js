angular.module('YTPlaylistManager')
.directive('playlistList', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'js/directives/playlist-list/playlist-list.html'
  };
});