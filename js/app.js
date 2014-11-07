var app = angular.module('playlistManager', [])


.controller('LoginCtrl', ['$scope', function($scope){
    var CLIENT_ID = '877549163404-chjiknp3ffeiatmb2mcb8dfp23u7sm8q.apps.googleusercontent.com',
    SCOPES = [
      'https://www.googleapis.com/auth/youtube'
    ],
    apiKey = 'AIzaSyDJIOlGzyjPFEQ5j-Q2qEJVbOJtgqmby_Y';

    $scope.channelId = '';
    $scope.playlists = [];
    $scope.title = "lololo";

    $scope.auth = function(){
        gapi.client.setApiKey = apiKey;
        window.setTimeout($scope.checkAuth, 1);
    };

    $scope.checkAuth = function() {
        gapi.auth.authorize({
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: true
        }, $scope.handleAuthResult);
    };

    $scope.handleAuthResult = function(authResult) {
        if (authResult && !authResult.error) {
            $scope.makeApiCall();
        } else {
            $('#login-link').click(function(){
                $scope.handleAuthClick();
            });
        }
    };

    $scope.handleAuthClick = function(event) {
        gapi.auth.authorize({
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: false
        }, $scope.handleAuthResult);
    };

    $scope.makeApiCall = function() {
        gapi.client.load('youtube', 'v3', function() {
            var request = gapi.client.youtube.channels.list({
                mine: true,
                part: 'id,contentDetails'
            });

            request.execute(function(response) {
                $scope.channelId = response.result.items[0].id;
                var playlists = response.items[0].contentDetails.relatedPlaylists;
                // console.log(response);
                $scope.getData(playlists);
            });
        });
    };

    $scope.getPlaylists = function(playlists) {

        for( var i in playlists ) {
            $scope.playlists[i] = playlists[i];
            var request = gapi.client.youtube.playlists.list({
                id: playlists[i],
                part: 'snippet'
            });

            var counter = 0;

            request.execute( function(response) {
                var playlist = response.items[0];
                // console.log(playlist);

                $scope.playlists[counter] = {
                    id: playlist.id,
                    title: playlist.snippet.title,
                    thumbnail: playlist.snippet.thumbnails.medium.url
                };
                counter++;
                alert($scope.playlists[counter]);
            });
        }
    };

    $scope.getData = function(type, id) {
        if( type = 'playlist') {

        }
    };
}]);

app.directive('ngSparkline', function() {
  return {
    restrict: 'A',
    require: '^ngCity',
    scope: {
      ngCity: '@'
    },
    template: '<div class="sparkline"><h4>Weather for {{ ngCity }}</h4></div>',
    controller: ['$scope', '$http', function($scope, $http) {
        var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=7&callback=JSON_CALLBACK&q=";

        $scope.getTemp = function(city) {
            $http({
                method: 'JSONP',
                url: url + city
            }).success(function(data) {
                var weather = [];

                angular.forEach(data.list, function(value) {
                    weather.push(value);
                });

                $scope.weather = weather;
            });
        };
    }],
    link: function(scope, iElement, iAttrs) {
        scope.getTemp(iAttrs.ngCity);

        scope.$watch('weahter', function(newVal) {
            if( newVal ) {
                var highs = [];

                angular.forEach(scope.weather, function(value) {
                    highs.push(value.temp.max);
                });
            }
        });
    }
  };
});

app.directive('ngCity', function() {
    return {
        controller: function($scope) {

        }
    };
});