window.LetsTalkApp = new (Backbone.Router.extend({
  routes: {
    "": "index"
  },

  initialize: function(){
  },

  index: function(){
    this.loginView = new LoginView();
    this.loginView.render();
    //$('#app').html(this.todosView.el);
    //this.todoItems.fetch();
  },

  start: function(){
    Backbone.history.start();

  },

  show: function(id){
  }
}));