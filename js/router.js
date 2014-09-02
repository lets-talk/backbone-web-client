window.LetsTalkApp = new (Backbone.Router.extend({
  routes: {
    "": "index",
    "chats": "chats",
    "chat/:id": "chat",
    "logout": "logout"
  },

  initialize: function() {
    this.client = new Client();
    this.baseURL = 'http://api.staging.letsta.lk';
  },

  index: function() {

    var app = $('div#app');
    app.html('');

    if (this.client.exists())
      this.navigate('chats', {trigger: true});

    else {
      var loginView = new LoginView();
      loginView.render();
      app.html(loginView.el);
    }
  },

  start: function() {
    Backbone.history.start();
  },

  logout: function() {
    this.client.reset();
    this.navigate('', {trigger: true});
  },

  chats: function() {

    var app = $('div#app');
    app.html('');

    if (!this.client.exists()) {
      this.navigate('');
      return;
    }

    this.chats = new Chats();
    var chatsView = new ChatsView({collection: this.chats});

    this.chats.fetch({reset: true});
    chatsView.render();
    console.log(chatsView.el);
    app.append('<div class="chats-loading">Cargando...</div>');
    app.append(chatsView.el);
    app.append('<a href="#logout">Salir</a>');

  },

  chat: function(id) {
    if (!this.client.exists()) {
      this.navigate('');
      return;
    }

    var app = $('div#app');
    app.html('');



  }
}));