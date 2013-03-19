'use strict';

angular.module('djroboto').service('YouTubeSearchService', ['$http', function($http) {
	var self = this;

	self.Query = function(ytQuery, callback) {
	    //TODO figure out how to get more than 5 results
	    var request = gapi.client.youtube.search.list({
	        'q': ytQuery.query,
	        'order': ytQuery.order,
	        'type': ytQuery.type,
	        'part': ytQuery.part
	    });

	    
	    request.execute(function(response) {
	    	var items;
  		    if (ytQuery.takeFirstResult && response.items.length > 0) {
  		    	items = [];
  		    	items[0] = response.items[0];
  		    }
  		    else {
  		    	items = response.items;
  		    }

	        for (var resultIndex in items) {
	            var result = items[resultIndex];

		    	$http.get("https://www.googleapis.com/youtube/v3/videos", {
		    		"id" : result.id.videoId,
		    		"key" : "AIzaSyCiYSFVgRONf6z5vjx8dj-NsKxL_3B48dk",
		    		"part" : "contentDetails",
		    		"fields" : "items(contentDetails(duration))"
		    	})
				.success(function(data, status, headers, config) {
				    var resultDuration = data.items[0].contentDetails.duration;

		            var video = new Video(
		            	escape(result.snippet.title),
		            	result.id.videoId,
		            	result.snippet.thumbnails.url,
		            	new Duration(resultDuration));

	      		    callback(video);
				})
				.error(function(data, status, headers, config) {
					
				});
	        }
	    });
	}

	self.QueryAll = function(queries, callback) {
		for (var queryIndex in queries) {
			self.Query(queries[queryIndex], callback);
		}
	}	
}]);