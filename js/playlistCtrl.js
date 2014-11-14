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
                    status: res[i].status.privacyStatus,
                    tags: res[i].snippet.tags
                };

                $scope.$apply(function(){
                    $scope.playlists[$scope.playlists.length] = newPlaylist;
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
                tags = $('#playlistTags').val().replace(/,\s/g, ',').split(','),
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
                if( angular.isUndefined(response.error) ) {
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
                    $('#errorModal').modal('show');
                }
            });
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
                            $scope.playlists.splice(index, 1);
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

    $scope.editPlaylist = function(index) {
        var pl = $scope.playlists[index];

         $scope.playlistToEdit = {
            id: pl.id,
            title: pl.title,
            status: pl.status,
            description: pl.description,
            tags: angular.isUndefined(pl.tags) ? '' : pl.tags.toString()
        };

        $('#editPlaylistModal').modal('show');

        $('#editPlaylistModal').on('click', '#editPlaylistSubmit', function() {
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
                    $scope.$apply(function() {
                        $scope.playlists[index].title = $scope.playlistToEdit.title;
                        $scope.playlists[index].description = $scope.playlistToEdit.description;
                        $scope.playlists[index].tags = angular.isUndefined($scope.playlistToEdit.tags) ? '' : $scope.playlistToEdit.tags;
                        $scope.playlists[index].status = $scope.playlistToEdit.status;
                    });
                } else {
                    console.error(response.code, response.error.message);
                    $('#errorModal').modal('show');
                }
            });
        });
    }

    $scope.getVideos = function(id) {

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
                    $scope.playlists[index].status = privacy;
                });
            } else {
                console.error(response.code, response.error.message);
                $('#errorModal').modal('show');
            }
        });
    };

    $scope.$on('logged', $scope.getPlaylists);
}]);