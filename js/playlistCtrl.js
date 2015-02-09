app.controller('playlistCtrl', ['$scope', '$rootScope', 'channel', 'Playlist', function($scope, $rootScope, channel, Playlist) {
    // $scope.playlistToken = '';
    $scope.playlistCount = channel.playlistCount;
    $scope.deleteAnswer = false;


    $scope.getPlaylists = function() {
        channel.requestPlaylists();

        $rootScope.$on('requestPlaylist', function() {
            $scope.$apply(function() {
                $scope.playlists = channel.playlists;
            });
        });
    };

    $scope.addVideo = function() {

    };

    $scope.playPlaylist = function(id) {

    };

    $scope.addNewPlaylist = function() {
        if( channel.authorized ) {
            var playlist = new Playlist($scope.newPlaylist);
                playlist.new(playlist);

            $rootScope.$on('newPlaylist', function() {
                $scope.$apply(function() {
                    channel.playlists.unshift(playlist);
                });
            });
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

    $scope.askDeletePlaylist = function(index) {
        $scope.playlistToDelete = $scope.playlists[index];
    };

    $scope.deletePlaylist = function() {
        $scope.playlistToDelete.delete();
        $rootScope.$on('deletePlaylist', function() {
            var i = $scope.playlists.indexOf($scope.playlistToDelete);
            console.log(i);
            $scope.$apply(function() {
                $scope.playlists.splice(i, 1);
            });
        });
    };

    $scope.prepareEditModal = function(index) {
        var pl = $scope.playlists[index];

        $scope.playlistToEdit = $scope.playlists[index];
    };

    $scope.editPlaylist = function() {
        $scope.playlistToEdit.edit();

        $rootScope.$on('editPlaylist', function() {
            $scope.$apply(function() {
                $scope.playlists = channel.playlists;
            })
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