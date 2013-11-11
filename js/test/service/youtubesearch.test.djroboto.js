'use strict';

describe('TestSuite', function() {

	var $scope;
	var $httpBackend;
	var $YouTubeSearchService;

	function HttpExpectations(response, durations) {
		$httpBackend.when('GET', /http:\/\/gapi\/mock\/.*/).respond(response);
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

	describe('YouTubeSearchService', function() {

		beforeEach(inject(function($injector) {
			$scope = $injector.get('$rootScope');
			$httpBackend = $injector.get('$httpBackend');
			$YouTubeSearchService = $injector.get('YouTubeSearchService');
			HttpExpectations(YouTubeSearch5Results, YouTubeSearch5ResultsDurations);
		}));

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('should return 5 Video results', function() {
			var done = false;

			var query = new YouTubeQuery('metallica');
			var results = [];
			$YouTubeSearchService.Query(query, function(video) {
				results.push(video);
			});

			setTimeout(function() {
				done = true;
			}, 500);

			waitsFor(function() {
				return done;
			});

			$httpBackend.flush();

			expect(results.length).toBe(5);
			for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {
				var result = results[resultIndex]
				expect(result.title).toMatch(/.*/);
				expect(result.id).toMatch(/.*/);
				expect(result.thumbnail).toMatch(/.*/);
				expect(result.duration.seconds).toBeGreaterThan(0);
			}
		});

		it('should return 1 Video result', function() {
			var done = false;

			var query = new YouTubeQuery('metallica', true);
			var results = [];
			$YouTubeSearchService.Query(query, function(video) {
				results.push(video);
			});

			setTimeout(function() {
				done = true;
			}, 500);

			waitsFor(function() {
				return done;
			});
			
			$httpBackend.flush();

			expect(results.length).toBe(1);
			for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {
				var result = results[resultIndex]
				expect(result.title).toMatch(/.*/);
				expect(result.id).toMatch(/.*/);
				expect(result.thumbnail).toMatch(/.*/);
				expect(result.duration.seconds).toBeGreaterThan(0);
			}
		});

		it('should return results from multiple queries', function() {
			var done = false;

			var queries = [];
			queries.push(new YouTubeQuery('metallica'));
			queries.push(new YouTubeQuery('megadeth'));
			queries.push(new YouTubeQuery('slayer'));
			queries.push(new YouTubeQuery('anthrax'));

			var results = [];
			$YouTubeSearchService.QueryAll(queries, function(video) {
				results.push(video);
			});

			setTimeout(function() {
				done = true;
			}, 500);
			
			waitsFor(function() {
				return done;
			});

			$httpBackend.flush();
			
			expect(results.length).toBe(20);
			for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {
				var result = results[resultIndex]
				expect(result.title).toMatch(/.*/);
				expect(result.id).toMatch(/.*/);
				expect(result.thumbnail).toMatch(/.*/);
				expect(result.duration.seconds).toBeGreaterThan(0);
			}
		});

		it('should return one result per query from multiple queries', function() {
			var done = false;

			var queries = [];
			queries.push(new YouTubeQuery('metallica', true));
			queries.push(new YouTubeQuery('megadeth', true));
			queries.push(new YouTubeQuery('slayer', true));
			queries.push(new YouTubeQuery('anthrax', true));

			var results = [];
			$YouTubeSearchService.QueryAll(queries, function(video) {
				results.push(video);
			});

			setTimeout(function() {
				done = true;
			}, 500);
			
			waitsFor(function() {
				return done;
			});

			$httpBackend.flush();
			
			expect(results.length).toBe(4);
			for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {
				var result = results[resultIndex]
				expect(result.title).toMatch(/.*/);
				expect(result.id).toMatch(/.*/);
				expect(result.thumbnail).toMatch(/.*/);
				expect(result.duration.seconds).toBeGreaterThan(0);
			}
		});

	});
});