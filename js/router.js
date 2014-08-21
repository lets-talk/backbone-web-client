window.LetsTalkApp = new (Backbone.Router.extend({
  routes: {
    "": "index"
  },

  initialize: function(){
    //this.todoItems = new TodoItems();
    this.loginView = new LoginView({ el: "#login-form" });
    this.loginView.render();
  },

  index: function(){
    //$('#app').html(this.todosView.el);
    //this.todoItems.fetch();
  },

  start: function(){
    Backbone.history.start();
  },

  show: function(id){
  }
}));