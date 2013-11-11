'use strict';

describe('TestSuite', function() {

	var $scope;
	var $httpBackend;
	var $iTunesChartService;

	beforeEach(module('djroboto'));

	describe('iTunesChartService', function() {
		beforeEach(inject(function($injector) {
			$scope = $injector.get('$rootScope');
			$httpBackend = $injector.get('$httpBackend');
			$iTunesChartService = $injector.get('iTunesChartService');
		}));

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('should return YouTubeQuery objects that are set to take the first result', function() {
			var done = false;
			
			var genre = new Genre('Blues', 2); //The iTunes ID for Blues is 2
			genre.resultSize = 2;

			var response = iTunesChart2Results;
			$httpBackend.when('GET', 'https://itunes.apple.com/us/rss/topsongs/limit=2/genre=2/explicit=true/json').respond(response);

			var queries = [];
			$iTunesChartService.Query(genre, function(query) {
				queries.push(query);
			});

			setTimeout(function() {
				done = true;
			}, 500);

			waitsFor(function() {
				return done;
			});

			$httpBackend.flush();

			expect(queries.length).toBe(2)
			for (var queryIndex in queries) {
				var query = queries[queryIndex];
				expect(query.query).toMatch(/.* music/);
				expect(query.order).toBe('relevance');
				expect(query.type).toBe('video');
				expect(query.part).toBe('snippet');
				expect(query.takeFirstResult).toBe(true);
			}
		});

	});
});