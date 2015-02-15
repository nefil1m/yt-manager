app.controller('videoCtrl', ['$rootScope', '$scope', 'channel', function($rootScope, $scope, channel) {

    $scope.getVideos = function() {
        channel.requestVideos();
    };

    $scope.makeActive = function(index) {
        if( angular.isDefined(channel.activeVideo) ) {
            channel.activeVideo.selected = false;
        }

        if( channel.activePlaylist.videos.length > 0 ) {
            $scope.playlistTitle = channel.activePlaylist.title;

            channel.activeVideo = channel.activePlaylist.videos[index];
            channel.activeVideo.selected = true;
            channel.simplified.video = channel.activeVideo.title;
            channel.nextVideo = index;
            channel.startNextVid = true;

            channel.player.loadVideoById(channel.activeVideo.id);
        } else {
            $scope.$apply(function() {
                delete $scope.videos;
            });
        }
    };

    $scope.playOnlyThis = function(index) {
        if( angular.isDefined(channel.activeVideo) ) {
            channel.activeVideo.selected = false;
        }

        channel.activeVideo = channel.activePlaylist.videos[index];
        channel.activeVideo.selected = true;
        channel.simplified.video = channel.activeVideo.title;
        channel.startNextVid = false;

        channel.player.loadVideoById(channel.activeVideo.id);
    }

    $rootScope.$on('loadVideos', $scope.getVideos);
    $rootScope.$on('videosLoaded', function(event, index) {
        $scope.makeActive(index);
    });
    $rootScope.$on('applyVideo', function() {
        $scope.$apply(function() {
            $scope.videos = channel.activePlaylist.videos;
        });
    });
}]);