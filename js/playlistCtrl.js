app.controller('playlistCtrl', ['$scope', '$rootScope', 'channel', 'Playlist', function($scope, $rootScope, channel, Playlist) {
    // $scope.playlistToken = '';
    $scope.playlistCount = channel.playlistCount;
    $scope.deleteAnswer = false;
    $scope.playlistToDelete


    $scope.getPlaylists = function() {
        channel.requestPlaylists();

        // $rootScope.$on('requestPlaylist', function() {
        //     $scope.$apply(function() {
        //         $scope.playlists = channel.playlists;
        //     });
        // });
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
            $rootScope.$emit('throwError', {
                code: 401,
                error: {
                    message: "Not authorized"
                }
            });
        }
    };

    $scope.askDeletePlaylist = function(index) {
        $scope.deletePlaylist = function() {
            var title = $scope.playlists[index].title;
            $scope.playlists[index].delete();

            $rootScope.$on('deletePlaylist', function() {
                var i = $scope.playlists.indexOf($scope.playlists[index]);
                console.log(index, $scope.playlists);
                $scope.playlists.splice(i, 1);
                $rootScope.$emit('throwSuccess', 'Successfuly deleted playlist "' + title + '"' );
            });
        };
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
        $scope.$broadcast('getVideos');
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
}]);