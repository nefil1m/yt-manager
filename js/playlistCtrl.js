app.controller('playlistCtrl', ['$scope', 'channel', 'Playlist', function($scope, channel, Playlist) {
    // $scope.playlistToken = '';
    $scope.playlistCount = channel.playlistCount;
    $scope.newPlaylist = {

    }

    $scope.getPlaylists = function() {
        channel.requestPlaylists();
    };

    $scope.addVideo = function() {

    };

    $scope.playPlaylist = function(id) {

    };

    $scope.addNewPlaylist = function() {
        if( channel.authorized ) {
            var playlist = new Playlist($scope.newPlaylist);
            send = playlist.new(playlist);
            if( angular.isDefined(send) ) {
                channel.playlists.unshift(send);
            }
        } else {
            $('#errorModal').modal('show');
            playlist = {
                code: 401,
                error: {
                    message: "Not authorized"
                }
            }
        }
    };

    $scope.deletePlaylist = function(index) {
        $scope.playlistToDelete = {
            id: $scope.playlists[index].id,
            title: $scope.playlists[index].title
        };

        $('#confirmPlaylistDeleteModal').modal('show');

        $('#confirmPlaylistDeleteModal').on('click', 'button', function() {
            if( $(this).attr('id') == 'deletePlaylistYes' ) {
                var request = gapi.client.youtube.playlists.delete({
                    id: $scope.playlistToDelete.id
                });

                request.execute(function(response) {
                    if( angular.isUndefined(response.error) ) {
                        $scope.$apply(function() {
                            channel.playlists.splice(index, 1);
                        });
                        $('#confirmPlaylistDeleteModal').modal('hide');
                    } else {
                        console.error(response.code, response.error.message);
                    }
                });
            } else {
                $('#confirmPlaylistDeleteModal').modal('hide');
            }
        });
    };

    $scope.prepareEditModal = function(index) {
        var pl = $scope.playlists[index];

        $scope.playlistToEdit = $scope.playlists[index];
    };

    $scope.editPlaylist = function() {
        var request = gapi.client.youtube.playlists.update({
            id: $scope.playlistToEdit.id,
            part: 'snippet,status',
            snippet: {
                title: $scope.playlistToEdit.title,
                description: $scope.playlistToEdit.description,
                tags: angular.isUndefined($scope.playlistToEdit.tags) ? '' : $scope.playlistToEdit.tags.replace(/,\s/g, ",").split(',')
            },
            status: {
                privacyStatus: $scope.playlistToEdit.status
            }
        });

        request.execute(function(response) {
            if( angular.isUndefined(response.error) ) {
                $('#editPlaylistModal').modal('hide');
            } else {
                console.error(response.code, response.error.message);
                $('#errorModal').modal('show');
            }
        });
    }

    $scope.makeActive = function(index) {
        $.each(channel.playlists, function(index) {
            channel.playlists[index].selected = false;
        });
        $scope.activePlaylist = channel.playlists[index];
        channel.activePlaylist = $scope.activePlaylist;
        channel.simplified.activePlaylist = $scope.activePlaylist.title;
        $scope.activePlaylist.selected = !$scope.activePlaylist.selected;
        $scope.$broadcast('getVideos');
    };

    $scope.changePrivacy = function(index) {
        var item = $scope.playlists[index],
            privacy = item.status;

        if( privacy == 'private' ) {
            privacy = 'public';
        } else {
            privacy = 'private';
        }

        var request = gapi.client.youtube.playlists.update({
            id: item.id,
            part: 'snippet,status',
            snippet: {
                title: item.title,
                description: item.description,
                tags: item.tags
            },
            status: {
                privacyStatus: privacy
            }
        });

        request.execute(function(response) {
            if( angular.isUndefined(response.error) ) {
                $scope.$apply(function() {
                    channel.playlists[index].status = privacy;
                });
            } else {
                console.error(response.code, response.error.message);
                $('#errorModal').modal('show');
            }
        });
    };

    $scope.$on('getPlaylists', $scope.getPlaylists);
    $scope.$watch(function() { return channel.playlists }, function() {
        $scope.playlists = channel.playlists;
    }, true);
}]);