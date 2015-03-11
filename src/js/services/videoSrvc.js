app.factory('Video', ['YTResourceProvider', function(YTResourceProvider) {

  var Video = function(id) {
    this.id = id;

    // this.get = function() {
    //   var that = this;

    //   YTResourceProvider.getVideo(this.id)
    //     .then(function(response) {
    //       that.snippet = angular.copy(response.result.items[0].snippet);
    //       that.contentDetails = angular.copy(response.result.items[0].contentDetails);
    //       that.statistics = angular.copy(response.result.items[0].statistics);
    //     }, function(response) {
    //       console.log(response);
    //     });
    // };

    return this;
  }

  return Video;
}]);