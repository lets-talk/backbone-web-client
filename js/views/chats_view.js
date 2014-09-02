window.ChatsView = Backbone.View.extend({
    tagName: 'ul',
    id: "chat-list",

    initialize: function(){
        var self = this;
        this.markup = $("#chat-view-template").html();
        this.collection.on('reset', this.render, this);
    },

    render: function() {
        var chatsLoading = $('div.chats-loading').hide();
        if(this.collection.length > 0) {
            this.collection.forEach(this.addChat, this);
            chatsLoading.hide();
        }
        else 
            chatsLoading.show();

        return this;
    },

    addChat: function(chat) {
        var chatView = new ChatListView({model: chat});
        chatView.render();
        this.$el.append(chatView.el);
        //console.log(chatView.el);
    }
});