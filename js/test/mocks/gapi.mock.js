
var gapi = {
	'client' : {
		'youtube' : {
			'search' : {
				'list' : function(query) {
					return {
						'execute' : function (callback) {
							var $http;
							inject(function($injector) {
								$http = $injector.get('$http');
							});
							$http({
								method : 'GET',
								url : 'http://gapi/mock/' + query.q
							}).
							success(function(data, status, headers, config) {
								callback(data);
							});
						}
					}
				}
			}
		}
	}
};