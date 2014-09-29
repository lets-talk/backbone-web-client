//==============================================================================
//
//  Password Validation form view
//
//==============================================================================

(function(app, $)
{
    app.PasswordValidationFormView = Backbone.View.extend({
        
        passwordValid: false,
        
        initialize : function()
        {
            // Cache view elements
            
            this.$password     = this.$('#customer-chat-password-validation-password');
            
            this.$password.on('input change keydown blur', $.proxy(this.validateName, this));
        },
        
        reset : function()
        {
            this.$password.val('');            
            
            this.$password.removeClass('customer-chat-input-error');
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
            this.validatePassword();
            
            return this.passwordValid;
        }
    });

})(window.Application, jQuery);