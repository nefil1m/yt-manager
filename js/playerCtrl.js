app.controller('playerCtrl', ['$scope', 'channelData', function($scope, channelData) {
    $scope.videoDone = false;

    // $scope.onPlayerStateChange = function(e) {
    //     if( event.data == YT.PlayerState.PLAYING && !done ) {
    //         $scope.videoDone = true;
    //         changeStatus('play');
    //     }
    // }

    $scope.changeStatus = function(status) {
        var buttons = $('.player-buttons'),
            info = $('.play-status');

        buttons.find('.active').removeClass('active');

        switch(status) {
            case 'stop':
                buttons.find('.stop').addClass('active');
                info.find('.play-state').text('Stopped');
            break;

            case 'play':
                buttons.find('.play').addClass('active');
                info.find('.play-state').text('Playing');
            break;

            case 'pause':
                buttons.find('.pause').addClass('active');
                info.find('.play-state').text('Playing');
            break;
        }
    }

    $scope.init = function() {
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        $scope.createPlayer();
    };

    $scope.createPlayer = function() {
        $(window).load(function() {
            $scope.player = new YT.Player('player', {
                height: 450,
                width: 800,
                videoId: 'qDxtsPseia8',
                events: {
                    'onStateChange': $scope.onPlayerStateChange
                }
            });
        });
    }
}]);