app.controller('playlistCtrl', ['$scope', '$rootScope', 'channel', 'Playlist', 'Video', function($scope, $rootScope, channel, Playlist, Video) {

    $scope.playlistCount = channel.playlistCount;
    $scope.deleteAnswer = false;
    $scope.playlistToDelete;


    $scope.getPlaylists = function() {
        channel.requestPlaylists();
    };

    $scope.addVideo = function(index) {
        var playlist = channel.playlists[index];
        var request = gapi.client.youtube.playlistItems.insert({
            part: 'snippet',
            snippet: {
                playlistId: playlist.id,
                resourceId: {
                    kind: "youtube#video",
                    videoId: channel.activeVideo.id
                }
            }
        });

        request.execute(function(response) {
            if( angular.isUndefined(response.error) ) {
                if( angular.isDefined(playlist.videos) ) {
                    if( playlist.videos.length >= playlist.itemCount ) {
                        var video = new Video(channel.activeVideo.id);
                        video.get();
                        playlist.itemCount++;
                        playlist.videos.push(video);
                        $rootScope.$emit('throwSuccess', 'Added');
                    } else {
                        $rootScope.$emit('throwSuccess', 'Added');
                    }
                }
            } else {
                $rootScope.$emit('throwError', response.error);
            }
        })
    };

    $scope.addNewPlaylist = function() {
        if( channel.authorized ) {
            var playlist = new Playlist();
                playlist.new($scope.newPlaylist);

            channel.playlists.unshift(playlist);
        } else {
            $rootScope.$emit('throwError', { code: 401, message: "Not authorized" } );
        }
    };

    $scope.askDeletePlaylist = function(index) {
        $scope.makeActive(index);
    };

    $scope.deletePlaylist = function() {
        var title = $scope.activePlaylist.title;

        $scope.activePlaylist.delete();

        $rootScope.$on('deletePlaylist', function() {
            $.each($scope.playlists,  function(index) {
                if( $scope.playlists[index] == $scope.activePlaylist ) {
                    channel.playlists.splice(index, 1);
                }
            });
            $scope.$apply(function() {
                $scope.playlists = channel.playlists;
            });
            $rootScope.$emit('throwSuccess', 'Successfuly deleted playlist "' + title + '"' );
        });
    };

    $scope.prepareEditModal = function(index) {
        var pl = $scope.playlists[index];

        $scope.playlistToEdit = $scope.playlists[index];
    };

    $scope.editPlaylist = function() {
        $scope.playlistToEdit.edit();
    };

    $scope.makeActive = function(index) {
        $.each(channel.playlists, function(index) {
            channel.playlists[index].selected = false;
        });
        channel.activePlaylist = channel.playlists[index];
        $scope.activePlaylist = channel.activePlaylist;
        channel.simplified.activePlaylist = $scope.activePlaylist.title;
        $scope.activePlaylist.selected = true;
        channel.startNextVid = true;
    };

    $scope.loadVideos = function(index) {
        $scope.makeActive(index);
        if( angular.isUndefined(channel.activePlaylist.videos) ) {
            $rootScope.$emit('loadVideos');
        } else {
            $rootScope.$emit('refreshVideos');
        }
    };

    $scope.changePrivacy = function(index) {
        var privacy = $scope.playlists[index].status;

        if( privacy == 'private' ) {
            privacy = 'public';
        } else {
            privacy = 'private';
        }

        $scope.playlists[index].updatePrivacy(privacy);

        $rootScope.$on('changePrivacy', function() {
            $scope.$apply(function() {
                $scope.playlists[index].status = privacy;
            });
        });
    };

    $scope.$on('getPlaylists', $scope.getPlaylists);
    $rootScope.$on('applyPlaylist', function() {
        $scope.$apply(function() {
            $scope.playlists = channel.playlists;
        });
    });
    $scope.$on('addVideo', function(e, index) {
        $scope.addVideo(index);
    });
}]);