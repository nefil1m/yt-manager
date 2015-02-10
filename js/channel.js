app.service('channel', ['$rootScope', 'Playlist', function($rootScope, Playlist) {

    var channel = {
        // id: '',
        // title: 'title',
        authorized: false,
        // playlistCount: 1,
        playlists: [
        //     {
        //         id: '',
        //         title: '',
        //         description: '',
        //         tags: [],
        //         status: '',
        //         videos: [
        //             {
        //                 id: '',
        //                 title: '',
        //                 author: '',
        //                 description: '',
        //                 likes: '',
        //                 dislikes: '',
        //                 views: '',
        //                 publishedAt: ''
        //             }
        //         ]
        //     }
        ],
        activePlaylist: {
        //     id: '',
        //     title: '',
        //     description: '',
        //     tags: [],
        //     status: '',
            // videos: [
        //         {
        //             id: '',
        //             title: '',
        //             author: '',
        //             description: '',
        //             likes: '',
        //             dislikes: '',
        //             views: '',
        //             publishedAt: ''
        //         }
            // ]
        },
        activeVideo: {
            title: 'Touch and go - Tango in Harlem'
        },
        // prevVideo: '',
        // nextVideo: '',
        playState: 'stopped',
        simplified: {
            playState: 'stopped'
        },
        requestPlaylists: function() {
            if( channel.authorized ) {

                if( angular.isUndefined(channel.playlistCount) || channel.playlists.length < channel.playlistCount ) {

                    var options = {
                        channelId: channel.id,
                        part: 'id',
                        maxResults: 5
                    }

                    if( angular.isDefined(channel.playlistToken) ) {
                        options.pageToken = channel.playlistToken;
                    }

                    var request = gapi.client.youtube.playlists.list(options);

                    request.execute(function(response) {
                        if( angular.isUndefined(response.error) ) {

                            channel.playlistToken = response.result.nextPageToken;
                            channel.playlistCount = response.result.pageInfo.totalResults;

                            var res = response.result.items,
                                playlists = [];

                            $.each(res, function(i) {
                                playlists[i] = new Playlist(res[i]);
                                playlists[i].get(playlists[i]);
                            });

                            channel.playlists = channel.playlists.concat(playlists);

                            $rootScope.$emit('requestPlaylist');

                        } else {
                            console.error(response.code, response.error.message);
                            $('#errorModal').modal('show');
                        }
                    });
                } else {
                    $("#playlists").find('.next-button').hide();
                }
            } else {
                $('#errorModal').modal('show');
            }
        }
    };

    return channel;
}]);
