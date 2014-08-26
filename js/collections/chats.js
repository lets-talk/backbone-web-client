window.Chats = Backbone.Collection.extend({
  model: Chat,
  url: function() {
  	return window.LetsTalkApp.baseURL + '/conversations?auth_token=' + window.LetsTalkApp.client.get('userAuthToken') + 
  		'&sync_time=' + window.LetsTalkApp.client.get('syncTime') + 
  		'&client_id=' + window.LetsTalkApp.client.get('userId') + 
  		'&filter_empty_conversations=true';
  },

  initialize: function(){

  }
});