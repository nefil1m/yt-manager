app.directive('playlist', ['$rootScope', 'channel', function($rootScope, channel) {
    return {
        restrict: 'E',
        templateUrl: 'templates/playlist.html',
        replace: true
        // link: function($scope, element, attrs) {
        //     $scope.$watch(function() { return channel.playlists }, function() {
        //         $scope.playlists = channel.playlists;
        //     }, true);
        // }
    };
}]).directive('ytVideo', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'templates/video.html',
        replace: true
    };
}]);