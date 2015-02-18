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
        $scope.$apply(function() {
            $scope.error = err;
        });
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

    $rootScope.translateDuration = function(dur) {
        var l = dur.length;
        var indexT = dur.indexOf('T');
        if( indexT != -1 ) {
            dur = dur.slice(indexT + 1, l);
        } else {
            dur = dur.slice(2, l);
        }

        var indexH = dur.indexOf('H'),
          h = indexH != -1 ? dur.slice(0, indexH) : '',
          indexM = dur.indexOf('M'),
          m = indexM != -1 ? dur.slice(indexH + 1, indexM) : '0',
          indexS = dur.indexOf('S'),
          s = indexS != -1 ? dur.slice(indexM + 1, indexS) : '';

        var output = '';

        if( h != '' ) {
            output += h + ':';
            if( m.length == 1 ) {
                m = '0' + m;
            }
        }
        if( m != '' ) {
            output += m + ':';
            if( s.length == 1 ) {
                s = '0' + s;
            }
        }
        if( s != '' ) {
            output += s;
        }

        return output;
    };

    $scope.addVideo = function() {
        var index = channel.playlists.indexOf(channel.activePlaylist);
        if( index !== -1 ) {
            $scope.$broadcast('addVideo', index);
        }
    };
}]);