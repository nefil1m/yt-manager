app.controller('playerCtrl', ['$scope', 'channel', function($scope, channel) {
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
        if( event.data == 0 ) {
            if( angular.isDefined(channel.activeVideo) ) {
                channel.activeVideo.selected = false;
            }

            if( angular.isUndefined(channel.nextVideo) ) {
                channel.nextVideo = 0;
            }

            if( channel.activePlaylist.itemCount >= channel.activePlaylist.videos.length ) {
                if( channel.nextVideo >= channel.activePlaylist.videos.length - 2 ) {
                    channel.requestVideos();
                    channel.nextVideo += 1;
                } else {
                    channel.nextVideo += 1;
                }
            } else {
                channel.nextVideo = 0;
            }

            channel.activeVideo = channel.activePlaylist.videos[channel.nextVideo];
            channel.activeVideo.selected = true;
            channel.simplified.video = channel.activeVideo.title;

            channel.player.loadVideoById(channel.activePlaylist.videos[channel.nextVideo].id); // xD
        }
    };

    $scope.createPlayer = function() {
        $(window).load(function() {
            channel.player = new YT.Player('player', {
                height: '100%',
                width: '100%',
                videoId: 'qDxtsPseia8',
                events: {
                    // 'onReady': emitStateChange,
                    'onStateChange': emitStateChange
                }
            });
        });
    };

    // $scope.playNextVideo = function() {
    //     var index = channel.nextVideo;

    //     if( angular.isDefined(channel.nextVideo) ) {
    //         channel.loadVideoById(channel.activePlaylist.videos[index].id);
    //         channel.nextVideo++;
    //     }
    // };
}]);