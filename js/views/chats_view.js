window.ChatsView = Backbone.View.extend({
    el: "#chats",
    events: {
        "click a#logout": "logout"
    },

    initialize: function(){
        var self = this;
        this.markup = $("#chat-view-template").html();

        this.collection.on('reset', function(){
            console.log('hola!');
        })
    },

    render: function() {
        
        this.collection.forEach(this.addChat, this);
        $(this.el).html(this.markup);
        return this;
    },

    logout: function(e){
        e.preventDefault();
        window.LetsTalkApp.client.reset();
    },

    addChat: function(chat) {
        var chatView = new ChatView({model: chat});
        this.$el.append(chatView.render().el);
    }
});