'use strict';

angular.module('djroboto').controller('Finder', ['$scope', 'YouTubeSearchService', 'iTunesChartService', 'PlaylistService',
	function($scope, YouTubeSearchService, iTunesChartService, PlaylistService) {
		$scope.query = '';
		$scope.genre = null;
		$scope.results = [];

		$scope.QueryYouTube = function() {
			$scope.results.length = 0;
			if ($scope.query != '') {
				YouTubeSearchService.Query(new YouTubeQuery($scope.query), function(video) {
					if ($scope.results.length >= 5) {
						$scope.results.length = 0;
					}
					$scope.results.push(video);
				});
			}
		}

		$scope.Select = function(video) {
			PlaylistService.Add(video);
			$scope.results.length = 0;
		}

		$scope.LoadGenre = function() {
			var genre = {};
			for (genreIndex in GenreList) {
				var found = GenreList[genreIndex];
				if (found.id == $scope.genre) {
					genre = new Genre(found.name, found.id);
				}
			}

			iTunesChartService.Query(genre, function(query) {
				YouTubeSearchService.Query(query, function(video) {
					PlaylistService.Add(video);
				})
			});
		}

		$scope.GetGenres = function() {
			return GenreList;
		}
	}
]);
