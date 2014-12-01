app.controller('mainCtrl', ['$scope', 'channelData', function($scope, channelData) {

    $scope.makeExcerpt = function(string) {
        if( string.length >= 119 ) {
            return string.slice(0,120) + "...";
        } else if( string.length <= 0 ) {
            return "...";
        } else {
            return string;
        }
    };
}]);