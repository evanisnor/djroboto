'use strict';

angular.module('djroboto').service('iTunesChartService', ['$http', function($http) {
	var self = this;

	self.Query = function(genre, callback) {
		// var queries = [];

		$http({
			method : 'GET',
			url : self.GenerateiTunesUrl(genre)
		}).
		success(function(data, status, headers, config) {
			for (var dataIndex in data.feed.entry) {
				var title = data.feed.entry[dataIndex].title.label
				// queries.push(new YouTubeQuery(title, true));
				callback(new YouTubeQuery(title, true));
			}
		}).
		error(function(data, status, headers, config) {
		});
		
		// return queries;
	}

	self.GenerateiTunesUrl = function(genre) {
		return sprintf("https://itunes.apple.com/us/rss/topsongs/limit=%s/genre=%s/explicit=%s/json",
			genre.resultSize, genre.id, genre.allowExplicit);
	}
}]);