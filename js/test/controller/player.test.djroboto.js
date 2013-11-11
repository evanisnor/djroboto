'use strict';

describe('TestSuite', function() {

	var $scope
	var $playlist;
	var $player;

	var GenerateRandomVideos = function(amount) {
		var videos = [];
		for (var v = 0; v < amount; v++) {
			videos.push(new Video('test' + v, 'xFeF3gJi', 'http://fake.com/test.png', new Duration('PT3M45S')));
		}
		return videos;
	}

	beforeEach(module('djroboto'));

	describe('Player', function() {
	
		beforeEach(inject(function($injector, $controller) {
			console.log("-----------------------");
			$scope = $injector.get('$rootScope');
			$playlist = $injector.get('PlaylistService');
			$player = $controller('Player', {
				'$scope' : $scope,
				'PlaylistService' : $playlist
			});
			$playlist.RegisterEventCallback($scope.onPlaylistStateChange);
		}));

		afterEach(function() {
			$playlist.Clear();
			$playlist.UnregisterEventCallback($scope.onPlaylistStateChange);
			console.log("-----------------------");
		});

		it('should play the first song automatically', function() {
			$playlist.AddAll(GenerateRandomVideos(1));
			expect($scope.isPlaying).toBe(true);
			expect($scope.currentVideo).not.toBeNull();
			expect($scope.nextVideo).toBeNull();
		});

		it('should know what the next song to be played will be', function() {
			$playlist.AddAll(GenerateRandomVideos(2));
			expect($scope.isPlaying).toBe(true);
			expect($scope.currentVideo).not.toBeNull();
			expect($scope.nextVideo).not.toBeNull();
		});

		it('should know the total running time of the playlist', function() {
			$playlist.AddAll(GenerateRandomVideos(10));
			expect($scope.playlistRunningTime.seconds).toBe(((60 * 3) + 45) * 9);
		});

		it('should know the total running time of the playlist plus the current video', function() {
			$playlist.AddAll(GenerateRandomVideos(10));
			expect($scope.isPlaying).toBe(true);
			expect($scope.playlistRunningTime.seconds).toBe(((60 * 3) + 45) * 9);
			expect($scope.GetTotalRunningTime().seconds).toBe(((60 * 3) + 45) * 10);
		});

		it('should allow for skipping the current video and playing the next', function() {
			$playlist.AddAll(GenerateRandomVideos(10));
			expect($scope.isPlaying).toBe(true);
			expect($scope.currentVideo).not.toBeNull();
			expect($scope.nextVideo).not.toBeNull();
			expect($scope.playlistRunningTime.seconds).toBe(((60 * 3) + 45) * 9);

			$scope.Next();
			expect($scope.isPlaying).toBe(true);
			expect($scope.currentVideo).not.toBeNull();
			expect($scope.nextVideo).not.toBeNull();
			expect($scope.playlistRunningTime.seconds).toBe(((60 * 3) + 45) * 8);
		});

		it('should stop playing when the current video is finished and the playlist is empty', function() {
			var EndedEvent = {
				data : YT.PlayerState.ENDED
			};

			$playlist.AddAll(GenerateRandomVideos(3));
			expect($scope.isPlaying).toBe(true);
			expect($scope.currentVideo).not.toBeNull();
			expect($scope.nextVideo).not.toBeNull();
			expect($scope.playlistRunningTime.seconds).toBe(((60 * 3) + 45) * 2);

			$scope.onPlayerStateChange(EndedEvent);
			expect($scope.isPlaying).toBe(true);
			expect($scope.currentVideo).not.toBeNull();
			expect($scope.nextVideo).not.toBeNull();
			expect($scope.playlistRunningTime.seconds).toBe(((60 * 3) + 45));

			$scope.onPlayerStateChange(EndedEvent);
			expect($scope.isPlaying).toBe(true);
			expect($scope.currentVideo).not.toBeNull();
			expect($scope.nextVideo).toBeNull();
			expect($scope.playlistRunningTime.seconds).toBe(0);

			$scope.onPlayerStateChange(EndedEvent);
			expect($scope.isPlaying).toBe(false);
			expect($scope.currentVideo).toBeNull();
			expect($scope.nextVideo).toBeNull();
			expect($scope.playlistRunningTime.seconds).toBe(0);
		});

	});
});