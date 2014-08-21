window.LoginView = Backbone.View.extend({
    //el: $("#login-form"),
 
    events: {
        "click #login": "login"
    },

    initialize: function(){
        var self = this;

        this.login = $("#login-form").html();

        this.email = $("#email");
        this.password = $("#password");

        this.email.change(function(e){
        	self.model.set({email: $(e.currentTarget).val()});
        });

        this.password.change(function(e){
		  self.model.set({password: $(e.currentTarget).val()});
        });
    },

    login: function(){
        /*var email = this.model.get('email');
        var pword = this.model.get('password');
        alert("You logged in as " + email + " and a password of " + pword);
        return false;*/
        
        return false;
    },

    render: function() {
        alert('hol');
        this.$el.html('<h1>hola</h1>');
        //$(this.el).html(this.login);
        return this;
    }
});