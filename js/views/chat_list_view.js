window.ChatListView = Backbone.View.extend({
	tagName: 'li',	
    model: Chat,

    render: function() {
    	this.$el.append('<a href="#chat/' + this.model.get('id') + '">' + this.model.get('issue') + '</a>');
    }
});