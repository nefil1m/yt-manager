app.controller('playlistCtrl', ['$scope', 'channelData', function($scope, channelData) {
    $scope.playlists = channelData.playlists;
    $scope.playlistToken;

    $scope.getPlaylists = function() {

        var options = {
            channelId: channelData.id,
            part: 'id,snippet,status',
            maxResults: 5
        }

        if( angular.isDefined($scope.playlistToken) ) {
            options.pageToken = $scope.playlistToken;
        }

        var request = gapi.client.youtube.playlists.list(options);

        request.execute(function(response) {
            if( angular.isUndefined(response.error) ) {
                var res = response.result.items;
                $scope.playlistToken = response.result.nextPageToken;

                $.each(res, function(i) {
                    var newPlaylist = {
                        id: res[i].id,
                        thumbnail: res[i].snippet.thumbnails.medium.url,
                        title: res[i].snippet.title,
                        description: res[i].snippet.description,
                        excerpt: $scope.makeExcerpt(res[i].snippet.description),
                        status: res[i].status.privacyStatus,
                        tags: res[i].snippet.tags
                    };

                    $scope.$apply(function(){
                        channelData.playlists.push(newPlaylist);
                    });
                });
            } else {
                console.error(response.code, response.error.message);
                $('#errorModal').modal('show');
            }
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
                        excerpt: $scope.makeExcerpt(description),
                        thumbnail: res.snippet.thumbnails.medium.url,
                        status: res.status.privacyStatus
                    };

                    $scope.$apply(function() {
                        channelData.playlists.push(newPlaylist);
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
                            channelData.playlists.splice(index, 1);
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
                        channelData.playlists[index].title = $scope.playlistToEdit.title;
                        channelData.playlists[index].description = $scope.playlistToEdit.description;
                        channelData.playlists[index].excerpt = $scope.makeExcerpt($scope.playlistToEdit.description);
                        channelData.playlists[index].tags = angular.isUndefined($scope.playlistToEdit.tags) ? '' : $scope.playlistToEdit.tags;
                        channelData.playlists[index].status = $scope.playlistToEdit.status;
                    });
                } else {
                    console.error(response.code, response.error.message);
                    $('#errorModal').modal('show');
                }
            });
        });
    }

    $scope.makeActive = function(index) {
        $.each(channelData.playlists, function(index) {
            channelData.playlists[index].selected = false;
        });
        $scope.activePlaylist = channelData.playlists[index];
        channelData.activePlaylist = $scope.activePlaylist;
        channelData.simplified.activePlaylist = $scope.activePlaylist.title;
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
                    channelData.playlists[index].status = privacy;
                });
            } else {
                console.error(response.code, response.error.message);
                $('#errorModal').modal('show');
            }
        });
    };

    $scope.makeExcerpt = function(string) {
        if( string.length >= 119 ) {
            return string.slice(0,120) + "...";
        } else if( string.length <= 0 ) {
            return "...";
        } else {
            return string;
        }
    };

    $scope.$on('logged', $scope.getPlaylists);
}]);