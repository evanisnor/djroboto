'use strict';

angular.module('djroboto').service('YouTubeSearchService', ['$http', function($http) {
	var self = this;

	self.Query = function(ytQuery, callback) {
	    $http.get("https://gdata.youtube.com/feeds/api/videos"
	    	+ "?alt=json"
	    	+ "&q=" + ytQuery.query
	    	+ "&orderby=" + ytQuery.order
	    	+ "&max-results=" + ytQuery.quantity
	    	+ "&category=" + ytQuery.category,
	    	{'v' : 2}
		)
		.success(function(data, status, headers, config) {

			for (var entryIndex in data.feed.entry) {
				var result = data.feed.entry[entryIndex];
				var id = result.id.$t.match(/http:\/\/gdata.youtube.com\/feeds\/api\/videos\/(.*)/)[1];
	            var video = new Video(
	            	result.title.$t,
	            	id,
	            	result.media$group.media$thumbnail,
	            	new Duration(
	            		parseInt(result.media$group.yt$duration.seconds, 10)
	            	)
	            );

	  		    callback(video);
				
				if (ytQuery.takeFirstResult) {
					break;
				}
			}

		})
		.error(function(data, status, headers, config) {
			
		});
	}

	self.QueryAll = function(queries, callback) {
		for (var queryIndex in queries) {
			self.Query(queries[queryIndex], callback);
		}
	}	
}]);