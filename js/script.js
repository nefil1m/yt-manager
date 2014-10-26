var playlistId, videoId, nextPageToken, prevPageToken, activePlaylistId, activePlaylistName, activePlaylistThumbnail;

function requestUserPlaylists() {
  var request = gapi.client.youtube.channels.list({
    mine: true,
    part: 'id,contentDetails'
  });

  request.execute(function(response) {
    var html = "";
    console.log(response);

    var playlists = response.result.items[0].contentDetails.relatedPlaylists;

    for( var i in playlists ) {

      var request = gapi.client.youtube.playlists.list({
        id: playlists[i],
        part: 'snippet'
      });

      request.execute(function(response) {
        var playlist = response.result.items[0];

        if( playlist.snippet.title != 'Liked videos' &&
            playlist.snippet.title.slice(0,7) != 'Uploads' &&
            playlist.snippet.title != 'History' ) {

          console.log(playlist.snippet.title);
          html += '<li class="row item"><a href="#!" data-id="' +
          playlist.id +
          '"><div class="col-xs-12"><div class="pull-left th"><img src="' +
          playlist.snippet.thumbnails.medium.url +
          '"><div class="btn-group"><button type="button" class="btn btn-default add" title="Add current video to this playlist"><i class="glyphicon glyphicon-plus"></i></button><button type="button" class="btn btn-default listen" title="Play this playlist"><i class="glyphicon glyphicon-play"></i></button><button type="button" class="btn btn-default delete" title="Delete playlist"><i class="glyphicon glyphicon-ban-circle"></i></button></div></div><h4 class="title">' +
          playlist.snippet.title +
          '</h4></div></a></li>';
          $('#playlists-list').html(html);
        }
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
  console.log(videoSnippet);
  $('#playlist-videos').append(
    '<li class="row item"><a href="#!" data-id="' +
    videoSnippet.resourceId.videoId +
    '"><div class="col-xs-12"><div class="pull-left th"><img src="' +
    videoSnippet.thumbnails.medium.url +
    '"><div class="btn-group"><button type="button" class="btn btn-default add" title="Add current video to active playlist"><i class="glyphicon glyphicon-plus"></i></button><button type="button" class="btn btn-default listen" title="Play this video"><i class="glyphicon glyphicon-play"></i></button><button type="button" class="btn btn-default play-from-here" title="Plat this playlist starting from this video"><i class="glyphicon glyphicon-circle-arrow-right"></i></button><button type="button" class="btn btn-default delete" title="Delete video from playlist"><i class="glyphicon glyphicon-ban-circle"></i></button></div></div><h4 class="title">' +
    videoSnippet.title +
    '</h4><p class="author">' +
    videoSnippet.author +
    '<p class="excerpt">' +
    makeExcerpt(videoSnippet.description) +
    '</p></div></a></li>'
    );
}

function nextPage() {
  requestVideos(playlistId, nextPageToken);
}

function previousPage() {
  requestVideos(playlistId, prevPageToken);
}

function makeExcerpt(string) {
  return string.slice(0,120) + "...";
}

function playVideo(title) {
  player.loadVideoById({
    videoId: videoId,
    startSeconds: 0,
    endSeconds: 9999
  });
}

function appendActivePlaylist(id, name, thumbnail) {
  $('#active-playlist').html(
    '<li class="row item"><a href="#!" data-id="' +
    id +
    '"><div class="col-xs-12"><div class="pull-left th"><img src="' +
    thumbnail +
    '"><div class="btn-group"><button type="button" class="btn btn-default add" title="Add current video to this playlist"><i class="glyphicon glyphicon-plus"></i></button><button type="button" class="btn btn-default listen" title="Play this playlist"><i class="glyphicon glyphicon-play"></i></button><button type="button" class="btn btn-default delete" title="Delete playlist"><i class="glyphicon glyphicon-ban-circle"></i></button></div></div><h4 class="title">' +
    name +
    '</h4></div></a></li>'
    );

  $('.current-playlist').text(name);
}

// onclicks

//on playlist
$('#playlists-list').on('click', 'a', function(){
  playlistId = $(this).data('id');

  $('#playlists').removeClass('in');
  $('#playlist-videos, #active-playlist').addClass('in');

  activePlaylistName = $(this).find('.title').text();
  activePlaylistThumbnail = $(this).find('img').attr('src');

  appendActivePlaylist(playlistId, activePlaylistName, activePlaylistThumbnail);
  requestVideos(playlistId);
});

//on video
$('#playlist-videos').on('click', 'a', function(){
  var title = $(this).find('.title').text();
  videoId = $(this).data('id');
  playVideo(title);
});

$('#login-link').click(function(){
  checkAuth();
});

$('#authorizationModal').modal();
