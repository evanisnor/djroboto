'use strict';

angular.module('djroboto').service('PlaylistService', function() {
	/*
	PlaylistService

	AngularJS Service that manages a playlist of Video objects. Can return a random
	video and allow for peeking	at the next random video. Also allows for an event
	callback when the Playlist has been altered.
	*/

	var self = this;

	self.nextVideoIndex = null;
	self.playlist = [];
	self.runningTime = new Duration();
	self.callbacks = [];

	self.GetNextVideo = function() {
		/*
		Return the next random Video in the playlist. This removes that Video from
		the playlist. If you want to take a peek at the next video, use Peek().
		*/
		if (self.playlist.length == 0) {
			return null;
		}

		if (self.nextVideoIndex == null) {
			self.Advance();
		}

		var chosenVideo = self.playlist.splice(self.nextVideoIndex, 1)[0];
		self.runningTime = self.runningTime.subtract(chosenVideo.duration);
		self.FireEvent(Events.PlaylistChanged);
		
		self.Advance();
		return chosenVideo;
	}

	self.Peek = function() {
		/*
		Returns the next Video in the playlist. Does not modify the playlist.
		*/

		if (self.playlist.length == 0) {
			return null;
		}
		else if (self.nextVideoIndex == null) {
			self.Advance();
		}

		return self.playlist[self.nextVideoIndex];
	}

	self.Advance = function() {
		/*
		Randomly chooses a Video in the playlist.
		*/

		if (self.playlist.length == 0) {
			self.nextVideoIndex = null;
			self.FireEvent(Events.PlaylistEmpty);
		}
		else {
			self.nextVideoIndex = Math.floor(Math.random() * self.playlist.length);
			self.FireEvent(Events.PlaylistAdvanced);
		}
	}

	self.GetTotalRunningTime = function() {
		/*
		Calculates and returns the total number of seconds of playback remaining in
		the playlist.
		*/
		return self.runningTime;
		// var runningTime = new Duration();
		// for (var videoIndex in self.playlist) {
		// 	runningTime = runningTime.add(self.playlist[videoIndex].duration);
		// }
		// return runningTime;
	}

	self.Add = function(video, holdEvent) {
		/*
		Add a Video to the end of the playlist. Optionally, passing a boolean as a second
		argument will determine if the 'PlaylistChanged' event will be fired to callback
		callbacks. This is used by AddAll() by default so the event is not fired multiple
		times.
		*/

		if (typeof(holdEvent) == 'undefined') holdEvent = false;

		self.playlist.push(video);
		self.runningTime = self.runningTime.add(video.duration);

		if (self.playlist.length == 1) {
			self.FireEvent(Events.FirstVideoAdded);
		}

		if (!holdEvent) {
			self.FireEvent(Events.PlaylistChanged);
		}
	}

	self.AddAll = function(videos) {
		/*
		Adds an array of Video objects to the playlist. The 'PlaylistChanged' event will
		only be fired once after all Video objects have been added.
		*/

		for (var videoIndex in videos) {
			self.Add(videos[videoIndex], true);
		}
		self.FireEvent(Events.PlaylistChanged);
	}

	self.Clear = function() {
		/*
		Empties the playlist.
		*/
		self.playlist.length = 0;
	}

	self.FireEvent = function(event) {
		/*
		Notify all callbacks that the playlist has been altered by passing them
		the 'PlaylistChanged' event.
		*/

		for (var callbackIndex in self.callbacks) {
			self.callbacks[callbackIndex](event);
		}		
	}

	self.RegisterEventCallback = function(callback) {
		/*
		Register a callback to receive events when the playlist
		is altered.
		*/

		self.callbacks.push(callback);
	}

	self.UnregisterEventCallback = function(callback) {
		/*
		Unregister a previously registered callback for events.
		*/

		for (var callbackIndex in self.callbacks) {
			if (callback === self.callbacks[callbackIndex]) {
				self.callbacks.splice(callbackIndex, 1);
			}
		}
	}
});