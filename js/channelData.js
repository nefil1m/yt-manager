app.factory('channelData', function($rootScope) {
    this.channel = {
        // id: '',
        // title: 'title',
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
        }
    };

    return this.channel;
});
