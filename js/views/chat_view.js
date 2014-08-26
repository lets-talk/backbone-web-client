window.ChatView = Backbone.View.extend({
    el: "#chats",
    model: Chat,

    render: function() {
        this.$el.append('<li>Hola</li>');
    }
});