var playlistId, nextPageToken, prevPageToken;

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
      $('#video-container').html('Sorry you have no playlists');
    }
  });
}

function displayVideos(videoSnippet) {
  console.log(videoSnippet);
  var title = videoSnippet.title;
  var videoId = videoSnippet.resourceId.videoId;
  $('#video-container').append('<li><a href="#!" data-id="' + videoSnippet.resourceId.videoId + '">' + title + ' - ' + videoId + '</li>');
}

function nextPage() {
  requestVideos (playlistId, nextPageToken);
}

function previousPage() {
  requestVideos(playlistId, prevPageToken);
}

// onclicks

$('#playlists-list').on('click', 'a', function(){
  var target = $(this).data('id');
  requestVideos(target);
});

$('#login-link').click(function(){
  checkAuth();
});
