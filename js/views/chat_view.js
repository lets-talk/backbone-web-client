window.ChatView = Backbone.View.extend({
    tagName: 'ol',
    id: "chat-messages",

    initialize: function(){
        this.collection.on('reset', this.render, this);
    },

    render: function() {
        var chatsLoading = $('div.chats-loading').hide();
        if(this.collection.length > 0) {
            this.collection.forEach(this.addMessage, this);
            chatsLoading.hide();

            this.$el.position().top;
        }
        else 
            chatsLoading.show();

        return this;
    },

    addMessage: function(message) {
        var chatView = new MessageView({model: message});
        chatView.render();
        this.$el.append(chatView.el);
    }
});