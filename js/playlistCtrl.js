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
                var newPlaylist = {};
                newPlaylist.id = res[i].id;
                newPlaylist.thumbnail = res[i].snippet.thumbnails.medium.url;
                newPlaylist.title = res[i].snippet.title;
                newPlaylist.description = res[i].snippet.description;
                newPlaylist.status = res[i].status.privacyStatus;

                $scope.$apply(function(){
                    $scope.playlists[$scope.playlists.length] = newPlaylist;
                    $scope.title = channelData.title; // so goddamn ugly;
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

                    var newPlaylist = {};
                    newPlaylist.id = res.id;
                    newPlaylist.title = title;
                    newPlaylist.description = description;
                    newPlaylist.thumbnail = res.snippet.thumbnails.medium.url;
                    newPlaylist.status = res.status.privacyStatus;

                    $scope.$apply(function() {
                        $scope.playlists[$scope.playlists.length] = newPlaylist;
                    });
                } else {
                    console.error(response.code, response.error.message);
                }
            });
        }
    };

    $scope.deletePlaylist = function(id) {

    };

    $scope.getVideos = function(id) {

    };
}]);