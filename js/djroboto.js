'use strict';

angular.module('djroboto', [])
	.value('version', '0.1')
	.run(function() {
		//Do something important here later?
	})
	.config(['$httpProvider', function ($httpProvider) {	
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}]);
