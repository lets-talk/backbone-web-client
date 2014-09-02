window.Messages = Backbone.Collection.extend({
  model: Message,

  initialize: function(options){
    this.conversationId = options.conversationId;
  },
  
  url: function() {
  	return window.LetsTalkApp.baseURL + '/conversations/' + this.conversationId + '/messages?auth_token=' + window.LetsTalkApp.client.get('userAuthToken');
  }
});