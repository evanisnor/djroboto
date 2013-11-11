
var Video = function(title, id, thumbnail, duration) {
	if (duration == 'undefined') duration = new Duration();
	self = this;

	self.title = title;
	self.id = id;
	self.thumbnail = thumbnail;
	self.duration = duration;
}