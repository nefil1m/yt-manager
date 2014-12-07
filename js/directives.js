app.directive('playlist', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'templates/playlist.html',
        replace: true
    };
}]).directive('ytVideo', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'templates/video.html',
        replace: true
    };
}]);