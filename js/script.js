var playlistId, videoId, nextPageToken, prevPageToken;

function requestUserPlaylists() {
  var request = gapi.client.youtube.channels.list({
    mine: true,
    part: 'id,contentDetails'
  });

  request.execute(function(response) {
    var html = "";

    var playlists = response.result.items[0].contentDetails.relatedPlaylists;

    for( var i in playlists ) {

      var request = gapi.client.youtube.playlists.list({
        id: playlists[i],
        part: 'snippet'
      });

      request.execute(function(response) {
        var playlist = response.result.items[0];
        html += '<li><a href="#!" data-id="' + playlist.id + '"><img src="' + playlist.snippet.thumbnails.default.url + '">' + playlist.snippet.title + '</a></li>';
        $('#playlists-list').html(html);
      });
    }
  });
}

function requestVideos(playlistId, pageToken) {
  $('#video-container').html('');

  var requestOptions = {
    playlistId: playlistId,
    part: 'snippet',
    maxResults: 10
  };

  if (pageToken) {
    requestOptions.pageToken = pageToken;
  }

  var request = gapi.client.youtube.playlistItems.list(requestOptions);
  request.execute(function(response) {

    nextPageToken = response.result.nextPageToken;
    var nextVis = nextPageToken ? 'visible' : 'hidden';
    $('#next-button').css('visibility', nextVis);
    prevPageToken = response.result.prevPageToken;
    var prevVis = prevPageToken ? 'visible' : 'hidden';
    $('#prev-button').css('visibility', prevVis);

    var playlistItems = response.result.items;
    if (playlistItems) {
      $.each(playlistItems, function(index, item) {
        displayVideos(item.snippet);
      });
    } else {
      $('#video-container').html('Sorry you have no videos in this playlist');
    }
  });
}

function displayVideos(videoSnippet) {
  var title = videoSnippet.title;
  var videoId = videoSnippet.resourceId.videoId;
  $('#video-container').append('<li><a href="#!" data-id="' + videoSnippet.resourceId.videoId + '"><img src="' + videoSnippet.thumbnails.default.url + '">' + title + '</a></li>');
}

function nextPage() {
  requestVideos(playlistId, nextPageToken);
}

function previousPage() {
  requestVideos(playlistId, prevPageToken);
}

// onclicks

$('#playlists-list').on('click', 'a', function(){
  playlistId = $(this).data('id');
  requestVideos(playlistId);
});

$('#video-container').on('click', 'a', function(){
  videoId = $(this).data('id');
  player.loadVideoById({
    videoId: videoId,
    startSeconds: 0,
    endSeconds: 9999
  });
});

$('#login-link').click(function(){
  checkAuth();
});
