app.factory('Video', function() {
  var Video = function(id) {
    this.id = id;

    this.get = function() {
      var that = this;

      var request = gapi.client.youtube.videos.list({
        id: this.id,
        part: 'snippet,contentDetails,statistics'
      });

      request.execute(function(response) {
        var res = response.result.items[0];
        that.snippet = angular.copy(res.snippet);
        console.log(that);
      });
    };

    return this;
  }

  return Video;
});