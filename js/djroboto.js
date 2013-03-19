'use strict';

angular.module('djroboto', [])
	.value('version', '0.1')
	.run(function() {
		//Do something important here later?
	});

var InitializeGapi = function () {
    gapi.client.setApiKey('AIzaSyCiYSFVgRONf6z5vjx8dj-NsKxL_3B48dk');
    gapi.client.load('youtube', 'v3', function() {
        console.log('Initialized GAPI');
    });
}