'use strict';

describe('TestSuite', function() {

	var $scope;
	var $PlaylistService;

	var GenerateRandomVideos = function(amount) {
		var videos = [];
		for (var v = 0; v < amount; v++) {
			videos.push(new Video('test' + v, 'xFeF3gJi', 'http://fake.com/test.png', new Duration('PT3M45S')));
		}
		return videos;
	}

	beforeEach(module('djroboto'));

	describe('PlaylistService Tests', function() {
		beforeEach(inject(function($injector) {
			$scope = $injector.get('$rootScope');
			$PlaylistService = $injector.get('PlaylistService');
		}));

		it('should store a video', function() {
			var video = new Video('test1', 'xFeF3gJi', 'http://fake.com/test.png', new Duration('PT3M45S'));
			$PlaylistService.Add(video);
			expect($PlaylistService.playlist.length).toBe(1);
		});

		it('should store a few videos', function() {
			var videos = GenerateRandomVideos(10);
			$PlaylistService.AddAll(videos);
			expect($PlaylistService.playlist.length).toBe(10);
		});

		it('should store a lot of videos', function() {
			var videos = GenerateRandomVideos(50000);
			$PlaylistService.AddAll(videos);
			expect($PlaylistService.playlist.length).toBe(50000);
		});

		it('should return a random video', function() {
			var videos = GenerateRandomVideos(3);
			$PlaylistService.AddAll(videos);
			expect($PlaylistService.playlist.length).toBe(3);

			var randomVideo1 = $PlaylistService.GetNextVideo();
			expect($PlaylistService.playlist.length).toBe(2);

			var randomVideo2 = $PlaylistService.GetNextVideo();
			expect(randomVideo2).not.toEqual(randomVideo1);
			expect($PlaylistService.playlist.length).toBe(1);

			var randomVideo3 = $PlaylistService.GetNextVideo();
			expect(randomVideo3).not.toEqual(randomVideo1);
			expect(randomVideo3).not.toEqual(randomVideo2);
			expect($PlaylistService.playlist.length).toBe(0);
		});

		it('should return a random video and allow for peeking at the next random video', function() {
			var videos = GenerateRandomVideos(3);
			$PlaylistService.AddAll(videos);
			expect($PlaylistService.playlist.length).toBe(3);

			var randomVideo1 = $PlaylistService.GetNextVideo();
			expect($PlaylistService.playlist.length).toBe(2);
			expect($PlaylistService.Peek().title).toMatch('test\\d');
			expect($PlaylistService.Peek()).not.toEqual(randomVideo1);

			var randomVideo2 = $PlaylistService.GetNextVideo();
			expect(randomVideo2).not.toEqual(randomVideo1);
			expect($PlaylistService.playlist.length).toBe(1);
			expect($PlaylistService.Peek().title).toMatch('test\\d');
			expect($PlaylistService.Peek()).not.toEqual(randomVideo1);
			expect($PlaylistService.Peek()).not.toEqual(randomVideo2);
			
			var randomVideo3 = $PlaylistService.GetNextVideo();
			expect(randomVideo3).not.toEqual(randomVideo1);
			expect(randomVideo3).not.toEqual(randomVideo2);
			expect($PlaylistService.playlist.length).toBe(0);
			expect($PlaylistService.Peek()).toBeNull();
		});

		it('should return a lot of random videos', function() {
			var amount = 50;
			var videos = GenerateRandomVideos(amount);
			$PlaylistService.AddAll(videos);
			expect($PlaylistService.playlist.length).toBe(amount);

			var mockPlaylist = [];
			while($PlaylistService.playlist.length > 0) {
				var randomVideo = $PlaylistService.GetNextVideo();
				expect($PlaylistService.playlist).not.toContain(randomVideo);
				mockPlaylist.push(randomVideo);					
				amount--;
				expect($PlaylistService.playlist.length).toBe(amount);					
			}
		});

		it('should calculate the total running time of all videos', function() {
			var video1 = new Video('test1', 'xFeF3gJi', 'http://fake.com/test.png', new Duration('PT3M45S'));
			var video2 = new Video('test2', 'xFeF3gJi', 'http://fake.com/test.png', new Duration('PT3M45S'));
			var video3 = new Video('test3', 'xFeF3gJi', 'http://fake.com/test.png', new Duration('PT3M45S'));
			var videos = [video1, video2, video3];
			$PlaylistService.AddAll(videos);
			expect($PlaylistService.playlist.length).toBe(3);

			expect($PlaylistService.GetTotalRunningTime().seconds).toBe(((60 * 3) + 45) * 3);
		});

		describe('Playlist Event Tests', function() {
			var callbacks = {
				PlaylistChanged : 0,
				FirstVideoAdded : 0,
				PlaylistEmpty : 0,
				PlaylistAdvanced : 0
			}
			
			var callback = function(event) {
				if (event == Events.PlaylistChanged) {
					callbacks.PlaylistChanged++;
				}
				else if (event === Events.FirstVideoAdded) {
					callbacks.FirstVideoAdded++;
				}
				else if (event === Events.PlaylistEmpty) {
					callbacks.PlaylistEmpty++;
				}
				else if (event === Events.PlaylistAdvanced) {
					callbacks.PlaylistAdvanced++;
				}
			}

			beforeEach(function() {
				$PlaylistService.RegisterEventCallback(callback);	
			});

			afterEach(function() {
				callbacks.PlaylistChanged = 0;
				callbacks.FirstVideoAdded = 0;
				callbacks.PlaylistEmpty = 0;
				callbacks.PlaylistAdvanced = 0;
				$PlaylistService.UnregisterEventCallback(callback);
			});
			
			it('should report when a video is added', function() {
				runs(function() {
					var videos = GenerateRandomVideos(1);
					$PlaylistService.Add(videos[0]);
				});

				waits(500);

				runs(function() {
					expect(callbacks.PlaylistChanged).toBe(1);
					expect(callbacks.FirstVideoAdded).toBe(1);
					expect(callbacks.PlaylistEmpty).toBe(0);
					expect(callbacks.PlaylistAdvanced).toBe(0);
				});
			});

			it('should report when many videos are added, but not too much', function() {
				runs(function() {
					var videos = GenerateRandomVideos(5);
					$PlaylistService.AddAll(videos);
				});

				waits(500);

				runs(function() {
					expect(callbacks.PlaylistChanged).toBe(1);
					expect(callbacks.FirstVideoAdded).toBe(1);
					expect(callbacks.PlaylistEmpty).toBe(0);
					expect(callbacks.PlaylistAdvanced).toBe(0);
				});
			});
			
			it('should report when a video is advanced and the playlist becomes empty', function() {
				runs(function() {
					var videos = GenerateRandomVideos(2);
					$PlaylistService.AddAll(videos);
					videos.length = 0;
					videos = GenerateRandomVideos(2);
					$PlaylistService.AddAll(videos);
					
					expect($PlaylistService.Peek()).not.toBeNull();
					expect($PlaylistService.GetNextVideo()).not.toBeNull();
					expect($PlaylistService.Peek()).not.toBeNull();
					expect($PlaylistService.GetNextVideo()).not.toBeNull();
					expect($PlaylistService.Peek()).not.toBeNull();
					expect($PlaylistService.GetNextVideo()).not.toBeNull();
					expect($PlaylistService.Peek()).not.toBeNull();
					expect($PlaylistService.GetNextVideo()).not.toBeNull();
					expect($PlaylistService.Peek()).toBeNull();
					expect($PlaylistService.GetNextVideo()).toBeNull();
					expect($PlaylistService.Peek()).toBeNull();
				});

				waits(500);

				runs(function() {
					expect(callbacks.PlaylistChanged).toBe(6);
					expect(callbacks.FirstVideoAdded).toBe(1);
					expect(callbacks.PlaylistEmpty).toBe(1);
					expect(callbacks.PlaylistAdvanced).toBe(4);
				});
			});

			it('should allow for listeners to unregister and not receive events', function() {
				runs(function() {
					var videos = GenerateRandomVideos(2);
					$PlaylistService.AddAll(videos);

					$PlaylistService.UnregisterEventCallback(callback);
					
					videos.length = 0;
					videos = GenerateRandomVideos(2);
					$PlaylistService.AddAll(videos);
					
					expect($PlaylistService.Peek()).not.toBeNull();
					expect($PlaylistService.GetNextVideo()).not.toBeNull();
					expect($PlaylistService.Peek()).not.toBeNull();
					expect($PlaylistService.GetNextVideo()).not.toBeNull();
					expect($PlaylistService.Peek()).not.toBeNull();
					expect($PlaylistService.GetNextVideo()).not.toBeNull();
					expect($PlaylistService.Peek()).not.toBeNull();
					expect($PlaylistService.GetNextVideo()).not.toBeNull();
					expect($PlaylistService.Peek()).toBeNull();
					expect($PlaylistService.GetNextVideo()).toBeNull();
					expect($PlaylistService.Peek()).toBeNull();
				});

				waits(500);

				runs(function() {
					expect(callbacks.PlaylistChanged).toBe(1);
					expect(callbacks.FirstVideoAdded).toBe(1);
					expect(callbacks.PlaylistEmpty).toBe(0);
					expect(callbacks.PlaylistAdvanced).toBe(0);
				});
			});

		});
	});
});