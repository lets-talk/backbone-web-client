window.MessageView = Backbone.View.extend({
	tagName: 'li',	
    model: Message,

    render: function() {
    	if (this.model.get('person').email == window.LetsTalkApp.client.get('userEmail'))
    		this.$el.addClass('right')
    	else
    		this.$el.addClass('left')

    	this.$el.append(this.model.get('content'));
    }
});