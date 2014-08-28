window.LetsTalkApp = new (Backbone.Router.extend({
  routes: {
    "": "index",
    "chats": "chats",
    "chat/:id": "chat",
  },

  initialize: function() {
    this.client = new Client();
    this.baseURL = 'http://api.staging.letsta.lk';
    this.loginView = new LoginView();
  },

  index: function() {
    if (this.client.exists())
      this.navigate('chats', {trigger: true});

    else {
      this.loginView.render();
    }
  },

  start: function() {
    Backbone.history.start();
  },

  chats: function() {

    if (!this.client.exists()) {
      this.navigate('');
      return;
    }

    this.loginView.hide();

    this.chats = new Chats();

    /*this.chats.on('reset', function(){
      console.log('gola2');
    });*/

    this.chatsView = new ChatsView({collection: this.chats});
    this.chats.fetch();
    //this.chatsView.render();
  },

  chat: function(id) {
  }
}));