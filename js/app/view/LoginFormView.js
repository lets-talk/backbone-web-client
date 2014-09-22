//==============================================================================
//
//  Login form view
//
//==============================================================================

(function(app, $)
{
    app.LoginFormView = Backbone.View.extend({
    
        mailExp : new RegExp('^[-+\\.0-9=a-z_]+@([-0-9a-z]+\\.)+([0-9a-z]){2,}$', 'i'),
        
        mailValid : false,
        passwordValid : false,
        
        initialize : function()
        {
            // Cache view elements
            
            this.$mail     = this.$('#customer-chat-login-mail');
            this.$password = this.$('#customer-chat-login-password');
            
            this.$mail.on('input change keydown blur', $.proxy(this.validateMail, this));
            this.$password.on('input change keydown blur', $.proxy(this.validatePassword, this));
        },
        
        reset : function()
        {
            this.$mail.val('');
            this.$password.val('');
            
            this.$mail.removeClass('customer-chat-input-error');
            this.$password.removeClass('customer-chat-input-error');
        },
        
        validateMail : function()
        {
            if(this.$mail.val().length == 0 || !this.mailExp.test(this.$mail.val()))
            {
                this.$mail.addClass('customer-chat-input-error');
                
                this.mailValid = false;
            }
            else
            {
                this.$mail.removeClass('customer-chat-input-error');
                
                this.mailValid = true;
            }
        },

        validatePassword : function()
        {
            if(this.$password.val().length == 0)
            {
                this.$password.addClass('customer-chat-input-error');
                
                this.passwordValid = false;
            }
            else
            {
                this.$password.removeClass('customer-chat-input-error');
                
                this.passwordValid = true;
            }
        },
        
        isValid : function()
        {
            this.validateMail();
            this.validatePassword();
            
            return this.mailValid && this.passwordValid;
        }
    });

})(window.Application, jQuery);