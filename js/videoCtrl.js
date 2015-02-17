app.controller('videoCtrl', ['$rootScope', '$scope', 'channel', function($rootScope, $scope, channel) {

    $scope.getVideos = function() {
        channel.requestVideos();
    };

    $scope.makeActive = function(index) {
        if( angular.isDefined(channel.activeVideo) ) {
            channel.activeVideo.selected = false;
        }

        if( channel.activePlaylist.videos.length > 0 ) {
            $scope.playlistTitle = channel.activePlaylist.title;

            channel.activeVideo = channel.activePlaylist.videos[index];
            channel.activeVideo.selected = true;
            channel.simplified.video = channel.activeVideo.title;
            channel.nextVideo = index;
            channel.startNextVid = true;

            channel.player.loadVideoById(channel.activeVideo.id);
        } else {
            $scope.$apply(function() {
                delete $scope.videos;
            });
        }
    };

    $scope.playOnlyThis = function(index) {
        if( angular.isDefined(channel.activeVideo) ) {
            channel.activeVideo.selected = false;
        }

        channel.activeVideo = channel.activePlaylist.videos[index];
        channel.activeVideo.selected = true;
        channel.simplified.video = channel.activeVideo.title;
        channel.startNextVid = false;

        channel.player.loadVideoById(channel.activeVideo.id);
    };

    $scope.deleteVideo = function(index) {
        var id = channel.activePlaylist.videos[index].resId;
        var send = function(id) {
            var request = gapi.client.youtube.playlistItems.delete({
                id: id
            });

            request.execute(function(response) {
                if( angular.isUndefined(response.error) ) {
                    channel.activePlaylist.videos.splice(index, 1);
                    $scope.$apply(function() {
                        $scope.videos = channel.activePlaylist.videos;
                    });
                    $rootScope.$emit('throwSucces', 'Deleted');
                } else {
                    $rootScope.$emit('throwError', response.error);
                }
            });
        }

        if( angular.isUndefined(id) ) {
            var request = gapi.client.youtube.playlistItems.list({
                playlistId: channel.activePlaylist.id,
                part: 'id,snippet',
                maxResults: 50
            });

            request.execute(function(response) {
                var res = response.result.items;

                $.each(res, function(i) {
                    if( res[i].snippet.resourceId.videoId == channel.activePlaylist.videos[index].id ) {
                        channel.activePlaylist.videos[index].resId = res[i].id;

                        send(channel.activePlaylist.videos[index].resId);
                    }
                });
            });
        } else {
            send(channel.activePlaylist.videos[index].resId);
        }
    };

    $rootScope.$on('loadVideos', $scope.getVideos);
    $rootScope.$on('videosLoaded', function(event, index) {
        $scope.makeActive(index);
    });
    $rootScope.$on('applyVideo', function() {
        $scope.$apply(function() {
            $scope.videos = channel.activePlaylist.videos;
        });
    });
    $rootScope.$on('refreshVideos', function() {
        $scope.videos = channel.activePlaylist.videos;
        $scope.makeActive(0);
    });
}]);