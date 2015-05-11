angular.module('YTPlaylistManager')
.directive('playlistGrid', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'js/directives/playlist-grid/playlist-grid.html',
    link: function($rootScope, scope, elem, attrs) {
      $rootScope.resizeTh();
    }
  };
});