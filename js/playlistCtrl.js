app.controller('playlistCtrl', ['$scope', 'channelData', function($scope, channelData) {
    $scope.playlists = [];
    $scope.playStatus = 'stopped';
    $scope.prevPlaylistsToken;
    $scope.nextPlaylistsToken;

    $scope.getPlaylists = function() {
        var request = gapi.client.youtube.playlists.list({
            channelId: channelData.id,
            part: 'id,snippet,status',
            maxResults: 10
        });

        request.execute(function(response) {
            var res = response.result.items;

            // add pagination
            // $scope.nextPlaylistsToken = response.result.nextPageToken;

            $.each(res, function(i, value) {
                var newPlaylist = {
                    id: res[i].id,
                    thumbnail: res[i].snippet.thumbnails.medium.url,
                    title: res[i].snippet.title,
                    description: res[i].snippet.description,
                    status: res[i].status.privacyStatus
            };

                $scope.$apply(function(){
                    $scope.playlists[$scope.playlists.length] = newPlaylist;
                    // $scope.title = channelData.title; // so goddamn ugly;
                });
            });
        });
    };

    $scope.addVideo = function() {

    };

    $scope.playPlaylist = function(id) {

    };

    $scope.addNewPlaylist = function() {
        if( typeof channelData.id != 'undefined' ) {
            var title = $('#playlistName').val(),
                description = $('#playlistDescription').val(),
                tags = $('#playlistTags').val().split(' '),
                status = 'public';

            if( $('#playlistPrivate').is(':checked') ) {
                status = 'private';
            }

            var request = gapi.client.youtube.playlists.insert({
                part: 'snippet,status',
                resource: {
                    snippet: {
                        title: title,
                        description: description,
                        tags: tags
                    },
                    status: {
                        privacyStatus: status
                    }
                }
            });

            request.execute(function(response) {
                if( typeof response.error == 'undefined' ) {
                    var res = response.result;
                    $('#newPlaylistModal').modal('hide');

                    var newPlaylist = {
                        id: res.id,
                        title: title,
                        description: description,
                        thumbnail: res.snippet.thumbnails.medium.url,
                        status: res.status.privacyStatus
                    };

                    $scope.$apply(function() {
                        $scope.playlists[$scope.playlists.length] = newPlaylist;
                    });
                } else {
                    console.error(response.code, response.error.message);
                }
            });
        }
    };

    $scope.deletePlaylist = function(id, index) {
        var request = gapi.client.youtube.playlists.delete({
            id: id
        });

        request.execute(function(response) {
            console.log(response);
            if( typeof response.error == 'undefined' ) {
                $scope.$apply(function() {
                    $scope.playlists.splice(index, 1);
                });
            } else {
                console.error(response.code, response.error.message);
            }
        });
    };

    $scope.editPlaylist = function(index) {
        var pl = $scope.playlists[index];

        $scope.editPlaylist = {
            id: pl.id,
            title: pl.title,
            status: pl.status,
            description: pl.description,
            tags: pl.tags
        }
        console.log($scope.editPlaylist);

        $('#editPlaylistModal').modal('show');
    }

    $scope.getVideos = function(id) {

    };

    $scope.changePrivacy = function(index) {
        var item = $scope.playlists[index],
            privacy = item.status;

        console.log(privacy);

        if( privacy == 'private' ) {
            privacy = 'public';
        } else {
            privacy = 'private';
        }

        var request = gapi.client.youtube.playlists.update({
            id: item.id,
            part: 'snippet,status',
            snippet: {
                title: item.title
            },
            status: {
                privacyStatus: privacy
            }
        });

        request.execute(function(response) {
            if( typeof response.error == 'undefined' ) {
                $scope.$apply(function() {
                    $scope.playlists[index].status = privacy;
                });
            } else {
                console.error(response.code, response.error.message);
            }
        });
    };

    $scope.$on('logged', $scope.getPlaylists);
}]);