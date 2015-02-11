app.controller('mainCtrl', ['$rootScope', '$scope', 'channel', function($rootScope, $scope, channel) {
    var successBoxSpeed = 100;

    $scope.makeExcerpt = function(string) {
        if( string.length >= 119 ) {
            return string.slice(0,120) + "...";
        } else if( string.length <= 0 ) {
            return "...";
        } else {
            return string;
        }
    };

    $scope.throwSuccess = function(msg) {
        $scope.$apply(function() {
            $scope.msg = msg;
        });
        $('#successBox').slideDown(successBoxSpeed);

        var tOut = setTimeout(function() {
            $('#successBox').slideUp(successBoxSpeed);
        }, 7500);

        $('#successBox').find('span').click(function() {
            clearTimeout(tOut);
            $('#successBox').slideUp(successBoxSpeed);
        });
    }

    $rootScope.$on('throwError', function(event, err) {
        $scope.error = err;
        console.error(err.code, err.message);
        $('#errorModal').modal('show');
    });

    $rootScope.$on('throwSuccess', function(event, msg) {
        $scope.throwSuccess(msg);
    });

    $scope.$on('logged', function() {
        $scope.throwSuccess("Logged in as " + channel.title);
        $scope.$broadcast('getPlaylists');
    });
}]);