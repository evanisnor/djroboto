'use strict';

angular.module('djroboto').controller('Finder', ['$scope', 'query', 'genre', 'YouTubeSearchService', 'iTunesChartService', 'PlaylistService',
	function($scope, query, genre, YouTubeSearchService, iTunesChartService, PlaylistService) {
		$scope.query = query;
		$scope.genre = genre;
		$scope.results = [];

		$scope.QueryYouTube = function() {
			$scope.results.length = 0;
			YouTubeSearchService.Query(new YouTubeQuery($scope.query), function(video) {
				$scope.results.push(video);
			});
		}

		$scope.LoadGenre = function() {
			iTunesChartService.Query($scope.genre, function(query) {
				YouTubeSearchService.Query(query, function(video) {
					PlaylistService.Add(video);
				})
			});
		}
	}
]);
