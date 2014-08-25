window.Chats = Backbone.Collection.extend({
  model: Chat,
  url: '/@"/conversations?auth_token='+ $.cookie('auth_token') + '&sync_time=%@&client_id=%ld&filter_empty_conversations=true"',
  initialize: function(){

  }
});