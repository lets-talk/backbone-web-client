window.ChatsView = Backbone.View.extend({
    tagName: 'ul',
    id: "chat-list",
    events: {
        "click a#logout": "logout"
    },

    initialize: function(){
        var self = this;
        this.markup = $("#chat-view-template").html();
        this.collection.on('reset', this.render, this);
    },

    render: function() {
        if(this.collection.length > 0) {
            this.collection.forEach(this.addChat, this);
            $('div.chats-loading').hide();    
        }

        return this;
    },
    
    addChat: function(chat) {
        var chatView = new ChatView({model: chat});
        chatView.render();
        this.$el.append(chatView.el);
        //console.log(chatView.el);
    }
});