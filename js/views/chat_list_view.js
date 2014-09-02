window.ChatListView = Backbone.View.extend({
	tagName: 'li',	
    model: Chat,

    render: function() {
    	var lastMessage = this.model.get('last_message');
    	var lastMessageContent = lastMessage.content;
    	var lastMessageTime = lastMessage.created_at;
    	this.$el.append('<img width="70" height="70" src="' + this.model.get('client').avatar + ' "/><div class="message"><a href="#chat/' + this.model.get('id') + '">' + this.model.get('issue') + '</a><p class="last_message">' + lastMessageContent + '</p><p class="last_message_time"></p></div>');
    }
});