app.controller('videoCtrl', ['$rootScope', '$scope', 'channel', function($rootScope, $scope, channel) {
    Array.prototype.move = function(from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
    }

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
            channel.prevVideo = index - 1;
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

        if( angular.isUndefined(id) ) { // if video was added in current session it have no playlistItem id so we getting it here
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

    $scope.move = function(index, position) { // index in array and desired position
        if( position == 'last' ) {
            position = channel.activePlaylist.itemCount - 1;
        }

        var video = channel.activePlaylist.videos[index];

        var request = gapi.client.youtube.playlistItems.update({
            id: channel.activePlaylist.videos[index].resId,
            part: 'snippet,contentDetails',
            snippet: {
                playlistId: channel.activePlaylist.id,
                resourceId: {
                    kind: "youtube#video",
                    videoId: video.id
                },
                position: position
            },
            contentDetails: {
                note: video.note,
                startAt: video.startAt,
                endAt: video.endAt
            }
        });

        request.execute(function(response) {
            if( angular.isUndefined(response.error) ) {
                $scope.$apply(function() {
                    channel.activePlaylist.videos.move(index, position);
                    $scope.videos = channel.activePlaylist.videos;
                    channel.activePlaylist.nextVideo = position;
                });
            } else {
                $rootScope.$emit('throwError', response.error);
            }
        });
    }

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
    $rootScope.$on('playNext', function() {
        $scope.makeActive(channel.nextVideo + 1);
    });
    $rootScope.$on('playPrevious', function() {
        $scope.makeActive(channel.prevVideo);
    })
}]);