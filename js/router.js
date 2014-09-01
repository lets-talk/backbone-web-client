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
      $('div#chats').hide();
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

    $('#login-form').hide();
    $('div#chats').show();

    this.chats = new Chats();

    this.chatsView = new ChatsView({collection: this.chats});

    this.chats.fetch({reset: true});
    this.chatsView.render();
    $('div#chats').append(this.chatsView.el);

  },

  chat: function(id) {
    if (!this.client.exists()) {
      this.navigate('');
      return;
    }



  }
}));