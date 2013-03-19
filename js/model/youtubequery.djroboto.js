
var YouTubeQuery = function(query, takeFirstResult) {
	if (typeof(takeFirstResult) == 'undefined') takeFirstResult = false;

	this.query = query + ' music';
	this.order = 'relevance';
	this.type = 'video';
	this.part = 'snippet';
	this.takeFirstResult = takeFirstResult;
}