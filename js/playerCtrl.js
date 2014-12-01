app.controller('playerCtrl', ['$scope', 'channelData', function($scope, channelData) {
    $scope.videoDone = false;
    $scope.buttons = $('.player-buttons');
    var player;

    // $scope.onPlayerStateChange = function(e) {
    //     if( event.data == YT.PlayerState.PLAYING && !done ) {
    //         $scope.videoDone = true;
    //         changeStatus('play');
    //     }
    // }

    $scope.changeStatus = function(status) {

        // $scope.buttons.find('.active').removeClass('active');

        // switch(status) {
        //     case 'stop':
        //         $scope.buttons.find('.stop').addClass('active');
        //     break;

        //     case 'play':
        //         $scope.buttons.find('.play').addClass('active');
        //     break;

        //     case 'pause':
        //         $scope.buttons.find('.pause').addClass('active');
        //     break;
        // }
    }

    $scope.init = function() {
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        $scope.createPlayer();
    };

    var emitStateChange = function(event) {
        console.log('yay');
        channelData.player.playVideo();
    }

    $scope.createPlayer = function() {
        $(window).load(function() {
            channelData.player = new YT.Player('player', {
                height: '100%',
                width: '100%',
                videoId: 'qDxtsPseia8',
                event: {
                    'onReady': emitStateChange,
                    'onStateChange': emitStateChange
                }
            });

            // channelData.player.addEventListener('0', emitStateChange);
        });
    };

    $scope.playNextVideo = function() {
        var index = channelData.nextVideo;

        if( angular.isDefined(channelData.nextVideo) ) {
            channelData.loadVideoById(channelData.activePlaylist.videos[index].id);
            channelData.nextVideo++;
        }
    };
}]);