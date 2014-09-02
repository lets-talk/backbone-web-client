window.MessageView = Backbone.View.extend({
	tagName: 'li',	
    model: Message,

    render: function() {
    	this.$el.append(this.model.get('content'));
    }
});