app.controller('playerCtrl', ['$rootScope', '$scope', 'channel', function($rootScope, $scope, channel) {
    var player;

    $scope.init = function() {
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        $scope.createPlayer();
    };

    var emitStateChange = function(event) {
        if( channel.startNextVid && event.data == 0 ) {
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
            $rootScope.$emit('updateData'); // update video description
        }
    };

    $scope.createPlayer = function() {
        $(window).load(function() {
            channel.player = new YT.Player('player', {
                height: '100%',
                width: '100%',
                videoId: 'qDxtsPseia8',
                events: {
                    'onStateChange': emitStateChange
                }
            });
        });
    };
}]);