window.LoginView = Backbone.View.extend({
    el: $("#login-form"),
 
    events: {
        "click #login": "login"
    },

    initialize: function(){
        var self = this;

        this.login = $("#login-form").html();
        this.url = "http://54.183.100.51/api/v1/tokens/client";

        this.email = $("#email");
        this.password = $("#password");

        this.email.change(function(e){
        	self.model.set({email: $(e.currentTarget).val()});
        });

        this.password.change(function(e){
		  self.model.set({password: $(e.currentTarget).val()});
        });
    },

    login: function() {
        $.ajax({
            url: url
        });
        /*var email = this.model.get('email');
        var pword = this.model.get('password');
        alert("You logged in as " + email + " and a password of " + pword);
        return false;*/
        alert('hola');
    },

    render: function() {
        $(this.el).html(this.login);
        return this;
    }
});