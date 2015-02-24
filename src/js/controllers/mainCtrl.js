app.controller('mainCtrl', ['$rootScope', '$scope', 'channel', '$cookieStore', '$location', function($rootScope, $scope, channel, $cookieStore, $location) {
    var CLIENT_ID = '877549163404-chjiknp3ffeiatmb2mcb8dfp23u7sm8q.apps.googleusercontent.com',
        SCOPES = [ 'https://www.googleapis.com/auth/youtube' ],
        apiKey = 'AIzaSyDJIOlGzyjPFEQ5j-Q2qEJVbOJtgqmby_Y';

    $scope.auth = function(){
        gapi.client.setApiKey = apiKey;
        $scope.checkAuth();
    };

    $scope.checkAuth = function() {
        gapi.auth.authorize({
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: true
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

                channel.basic = {
                    authorized: true,
                    title: res.snippet.title,
                    id: res.id,
                    thumbnail: res.snippet.thumbnails.default.url
                };

                $location.url('/playlists');
                $scope.$apply();
            });
        });
    };

    $scope.channel = channel;

    var options = $cookieStore.get('options');

    if( angular.isDefined(options) ) {
        channel.options = options;
        if( channel.options.rememberMe ) {
            window.setTimeout(auth, 500);
        } else {
            $location.url('/');
        }
    }
}]);