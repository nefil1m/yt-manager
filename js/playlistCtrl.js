app.controller('playlistCtrl', ['$scope', '$rootScope', 'channel', 'Playlist', function($scope, $rootScope, channel, Playlist) {

    $scope.playlistCount = channel.playlistCount;
    $scope.deleteAnswer = false;
    $scope.playlistToDelete;


    $scope.getPlaylists = function() {
        channel.requestPlaylists();
    };

    $scope.addVideo = function() {

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
    };

    $scope.loadVideos = function(index) {
        $scope.makeActive(index);
        $rootScope.$emit('loadVideos');
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