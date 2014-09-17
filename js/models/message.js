window.Message = Backbone.Model.extend({
	isImage: function() {
		return this.get('content_type') == 'image/jpeg' || 
			this.get('content_type') == 'image/png' || 
				this.get('content_type') == 'image/jpg';
	}
});