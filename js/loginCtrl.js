app.controller('loginCtrl', function($scope, channelData) {
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

    var makeApiCall = function() {
        gapi.client.load('youtube', 'v3', function() {
            var request = gapi.client.youtube.channels.list({
                mine: true,
                part: 'id,snippet'
            });

            request.execute(function(response) {
                var res = response.result.items[0];

                $('.status').find('.authorization-btn').html('ok');
                channelData.id = res.id;
                channelData.title = res.snippet.title;
                channelData.simplified = {};
                channelData.simplified.channel = channelData.title;
                $scope.$broadcast('logged');
            });
        });
    };

    $('#login-link').click(function() {
      checkAuth();
    });
});