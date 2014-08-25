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
    },

    login: function(e) {
        e.preventDefault();

        var email = $("#email").val();
        var password = $("#password").val();

        if(!this.validateForm(email, password)) return

        $.ajax({
            type: 'POST',
            url: this.url,
            data: 'email=' + email + '&password=' + password,
            success: function(response, textStatus, jqXHR){
                window.client.setup();
            },
            error: function(xhr, status, error) {
                alert('Lo sentimos. El email y la contraseña no coinciden.');
            },
            dataType: 'json'
        });
    },

    render: function() {
        $(this.el).html(this.markup);
        return this;
    },

    validateForm: function(email, password) {
        if (!isEmail(email)) {
            alert('El email no es v&aacute;lido.');
            return false;
        }
        if (password == '') {
            alert('La contraseña no puede ser vacía.');
            return false;
        }
        return true;
    }
});