window.LetsTalkApp = new (Backbone.Router.extend({
  routes: {
    "": "index"
  },

  initialize: function() {
    this.client = new Client();
    this.baseURL = 'http://api.staging.letsta.lk';
  },

  index: function() {
    if (this.client.exists()) {
      this.chats = new Chats();
      this.chatView = new ChatsView({collection: this.chats});
      this.chats.fetch();
    }
    else {
      this.loginView = new LoginView();
      this.loginView.render();
    }
  },

  start: function() {
    Backbone.history.start();
  },

  show: function(id) {
  }
}));