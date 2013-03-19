'use strict';

describe('TestSuite', function() {

	var $scope;
	var $httpBackend;
	var $playlist;
	var $finder;

	function HttpExpectations(query, response, durations) {
		$httpBackend.when('GET', "http://gapi/mock/" + query).respond(response);
		for (var resultIndex = 0; resultIndex < response.items.length; resultIndex++) {
			var resultId = response.items[resultIndex].id.videoId;
			var resultDuration = durations[resultId];
			$httpBackend.when('GET', "https://www.googleapis.com/youtube/v3/videos", {
		    		"id" : resultId,
		    		"key" : "AIzaSyCiYSFVgRONf6z5vjx8dj-NsKxL_3B48dk",
		    		"part" : "contentDetails",
		    		"fields" : "items(contentDetails(duration))"
		    	}).respond(resultDuration);
		}
	}

	beforeEach(module('djroboto'));

	describe('Finder', function() {
	
		beforeEach(inject(function($injector, $controller) {
			$scope = $injector.get('$rootScope');
			$httpBackend = $injector.get('$httpBackend');
			$playlist = $injector.get('PlaylistService');
			$finder = $controller('Finder', {
				'$scope' : $scope,
				'query' : '',
				'genre' : {},
				'YouTubeSearchService' : $injector.get('YouTubeSearchService'),
				'iTunesChartService' : $injector.get('iTunesChartService'),
				'PlaylistService' : $playlist
			});
		}));

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('should return 5 Video results from a query', inject(function() {
			var done = false;
			HttpExpectations('metallica music', YouTubeSearch5Results, YouTubeSearch5ResultsDurations);

			$scope.query = 'metallica';
			$scope.QueryYouTube();

			setTimeout(function() {
				done = true;
			}, 500);

			waitsFor(function() {
				return done;
			});

			$httpBackend.flush();

			expect($scope.results.length).toBe(5);
		}));

		it('should load results of a Genre into the Playlist', function() {
			var done = false;

			$httpBackend.when('GET', 'https://itunes.apple.com/us/rss/topsongs/limit=2/genre=2/explicit=true/json').respond(iTunesChart2Results);
			HttpExpectations('At Last - Etta James music', FinderEttaJames, FinderEttaJamesDurations);
			HttpExpectations('Tell It Like It Is - Aaron Neville music', FinderAaronNeville, FinderAaronNevilleDurations);

			var genre = new Genre('Blues', 2); //The iTunes ID for Blues is 2
			genre.resultSize = 2;
			$scope.genre = genre;
			$scope.LoadGenre();

			setTimeout(function() {
				done = true;
			}, 500);

			waitsFor(function() {
				return done;
			});

			$httpBackend.flush();

			expect($playlist.playlist.length).toBe(2);
		});

	});
});