app.controller('mainCtrl', ['$scope', 'channel', function($scope, channel) {

    $scope.makeExcerpt = function(string) {
        if( string.length >= 119 ) {
            return string.slice(0,120) + "...";
        } else if( string.length <= 0 ) {
            return "...";
        } else {
            return string;
        }
    };

    $scope.$on('logged', function() {
        $scope.$broadcast('getPlaylists');
    });
}]);