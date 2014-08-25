window.LetsTalkApp = new (Backbone.Router.extend({
  routes: {
    "": "index"
  },

  initialize: function(){
  },

  index: function(){
    if ($.cookie('auth_token')) {
      this.chatView = new ChatView();
      this.chatView.render();
    }
    else {
      this.loginView = new LoginView();
      this.loginView.render();
    }
  },

  start: function(){
    Backbone.history.start();
    this.client = new Client();

  },

  show: function(id){
  }
}));