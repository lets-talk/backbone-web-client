window.LoginView = Backbone.View.extend({
    el: "#login-form",

    model: new Backbone.Model(),

    events: {
        "submit form": "login"
    },

    initialize: function(){
        var self = this;

        this.markup = $("#login-form-template").html();
        this.url = "http://api.staging.letsta.lk/api/v1/tokens/client";

        this.email = $("#email");
        this.password = $("#password");

        this.email.change(function(e){
        	self.model.set({email: $(e.currentTarget).val()});
        });

        this.password.change(function(e){
		  self.model.set({password: $(e.currentTarget).val()});
        });
    },

    login: function(e) {
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: this.url,
            data: 'email=' + this.email.val() + '&password=' + this.password.val(),
            success: function(response){
                alert(data);
            },
            dataType: 'json'
        });

        /*var email = this.model.get('email');
        var pword = this.model.get('password');
        alert("You logged in as " + email + " and a password of " + pword);
        return false;*/
        //alert('hola');
    },

    render: function() {
        $(this.el).html(this.markup);
        return this;
    }
});