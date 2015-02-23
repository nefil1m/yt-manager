app.controller('loginCtrl', ['$rootScope', '$scope', 'channel', function($rootScope, $scope, channel) {
    var CLIENT_ID = '877549163404-chjiknp3ffeiatmb2mcb8dfp23u7sm8q.apps.googleusercontent.com',
        SCOPES = [ 'https://www.googleapis.com/auth/youtube' ],
        apiKey = 'AIzaSyDJIOlGzyjPFEQ5j-Q2qEJVbOJtgqmby_Y';

    var auth = function(){
        gapi.client.setApiKey = apiKey;
        window.setTimeout($scope.checkAuth, 1);
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
                    id: res.id
                };

                $scope.$emit('logged');
            });
        });
    };
}]);