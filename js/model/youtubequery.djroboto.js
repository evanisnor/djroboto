
var YouTubeQuery = function(query, takeFirstResult) {
	if (typeof(takeFirstResult) == 'undefined') takeFirstResult = false;

	this.query = query;
	this.order = 'relevance';
	this.category = 'Music';
	this.quantity = 5;
	this.takeFirstResult = takeFirstResult;
}