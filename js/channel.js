app.service('channel', function($rootScope) {

    var channel = {
        // id: '',
        // title: 'title',
        authorized: false,
        playlistCount: 1,
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
        request: function(type) {
            if( channel.authorized ) {
                var request;

                switch(type) {
                    case 'playlist':
                        var options = {
                            channelId: channel.id,
                            part: 'id,snippet,status,contentDetails',
                            maxResults: 2
                        }

                        if( angular.isDefined(channel.playlistToken) ) {
                            options.pageToken = channel.playlistToken;
                        }

                        request = gapi.client.youtube.playlists.list(options);
                    break;
                }

                request.execute(function(response) {
                    if( angular.isUndefined(response.error) ) {
                        var res = response.result.items;

                        channel.playlistToken = response.result.nextPageToken;
                        channel.playlistCount = response.result.pageInfo.totalResults;
                        console.log(response);

                        $.each(res, function(i) {
                            var newItem = {
                                id: res[i].id,
                                thumbnail: res[i].snippet.thumbnails.medium.url,
                                title: res[i].snippet.title,
                                description: res[i].snippet.description,
                                status: res[i].status.privacyStatus,
                                tags: res[i].snippet.tags
                            };

                            channel.playlists.push(newItem);
                        });
                    } else {
                        console.error(response.code, response.error.message);
                        $('#errorModal').modal('show');
                    }
                });
            } else {
                $('#errorModal').modal('show');
            }
        },
        sendNewPlaylist: function(playlist) {
            if( channel.authorized ) {
                var request = gapi.client.youtube.playlists.insert(playlist);

                request.execute(function(response) {
                    if( angular.isUndefined(response.error) ) {
                        var res = response.result;
                        $('#newPlaylistModal').modal('hide');

                        playlist.id = res.id;
                        playlist.thumbnail = res.snippet.thumbnails.medium.url;
                    } else {
                        playlist = response;
                    }
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
            return playlist;
        },
        edit: function(pl) {

        }
    };

    return channel;
});
