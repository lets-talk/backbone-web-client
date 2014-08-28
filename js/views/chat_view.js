window.ChatView = Backbone.View.extend({
    el: "ul#chat-list",
    model: Chat,

    render: function() {
        this.$el.append('<li>Hola</li>');
    }
});