var CLIENT_ID = '877549163404-chjiknp3ffeiatmb2mcb8dfp23u7sm8q.apps.googleusercontent.com',
    SCOPES = [
      'https://www.googleapis.com/auth/youtube'
    ],
    apiKey = 'AIzaSyDJIOlGzyjPFEQ5j-Q2qEJVbOJtgqmby_Y';

    var auth = function(){
        gapi.client.setApiKey = apiKey;
        window.setTimeout(checkAuth, 1);
    };

    var checkAuth = function() {
        gapi.auth.authorize({
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: false
        }, makeApiCall);
    };

    // var handleAuthResult = function(authResult) {
        // if (authResult && !authResult.error) {
        //     makeApiCall();
        // } else {
        //     $('#login-link').click(function(){
                // handleAuthClick();
        //     });
        // }
    //     makeApiCall();
    // };

    // var handleAuthClick = function(event) {
    //     gapi.auth.authorize({
    //         client_id: CLIENT_ID,
    //         scope: SCOPES,
    //         immediate: false
    //     }, handleAuthResult);
    // };

    var makeApiCall = function() {
        gapi.client.load('youtube', 'v3', function() {
            var request = gapi.client.youtube.channels.list({
                mine: true,
                part: 'id,contentDetails,snippet'
            });

            request.execute(function(response) {
                var res = response.result.items[0];
                var playlists = res.contentDetails.relatedPlaylists.watchLater;

                channelId = res.id;

                $('.status').find('.authorization-btn').html('ok');
                $('.status').find('.channel').html(res.snippet.title);

                requestWatchLaterPlaylist(playlists);
                requestUserPlaylists(channelId);
            });
        });
    };