window.ChatView = Backbone.View.extend({
    el: "#chats",
    model: new Backbone.Model(),

    events: {
        "click a#logout": "logout"
    },

    initialize: function(){
        var self = this;
        this.markup = $("#chat-view-template").html();
    },

    render: function() {
        $(this.el).html(this.markup);
        return this;
    },

    logout: function(e){
        e.preventDefault();
        
    }
});