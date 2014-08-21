window.Chats = Backbone.Collection.extend({
  model: Chat,
  url: '/todos',
  initialize: function(){}
});