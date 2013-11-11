djRoboto
==========================
Random music player web app based on YouTube.

Developed by Evan W. Isnor using AngularJS and GAPI.
February/March 2013
ewisnor@gmail.com


Synopsis
--------------------------

User can populate a playlist of videos, which will be played back in a random order until the playlist is empty. Videos will be shown to the user, music will be played and songs can be skipped.


Usage
--------------------------

User has two available methods of populating a playlist:

1.  Manually searching for music videos and adding them to the Playlist
2.  Choosing a Genre that is automatically populated based on iTunes Charts

Once there is a video in the playlist, the process of choosing videos randomly for playback will begin. The playlist may grow as the app is performing video playback.

User has access to the full video controls provided by the embedded YouTube player. User may also skip to the next song.

View
--------------------------

User is presented with the following items:

*  A search box
*  A results panel that shows 5 results, with pagination for displaying more
*  A list of genres
*  Once playback has started:
	*  An embedded YouTube video
	*  A SKIP button
	*  The song that will be played next (if there is one)
	*  The amount of time remaining in the playlist


Model
--------------------------

The following are objects that comprise this application:

*  Video
	*  Title
	*  YouTube video ID
	*  URL to the thumbnail image
	*  Duration (courtesy of duration.js)
*  YouTubeQuery
	*  Query string
	*  order
	*  type
	*  snippet
	*  flag: take first result? (for automation)
*  Genre
	*  Name
	*  iTunes genre ID
	*  Result size

Controller
--------------------------

*  FinderController
	*  Accepts a query string or genre selection
	*  Generates a YouTubeQuery object or Genre object
	*  Calls the YouTubeSearchService or the iTunesChartService
	*  If called the iTunesChartService, pass the queries to the YouTubeSearchService
	*  Passes Video list results to the PlaylistService
*  PlayerController
	*  Handles Video and Playlist events to govern playback with.
		*  YT.PlayerState.ENDED
		*  YT.PlayerState.PLAYING
		*  YT.PlayerState.PAUSED
		*  YT.PlayerState.BUFFERING
		*  YT.PlayerState.CUED
		*  PlaylistChanged
	*  Stores the current Video
	*  has a skip() function that gets the next video from the PlaylistService


Services
--------------------------

*  YouTubeSearchService
	*  Accepts a YouTubeQuery
	*  Returns a list of Videos
*  iTunesChartService
	*  Accepts a Genre
	*  Returns a list of YouTube Queries
*  PlaylistService
	*  an array of Videos
	*  pop off the next Video (random)
	*  peek at the next chosen Video
	*  append Video(s)
	*  get total running time
	*  check if a video is already in the Playlist
