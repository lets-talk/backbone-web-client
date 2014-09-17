//==============================================================================
//
//  Main window view
//
//==============================================================================

(function(app, $, config)
{
    app.WindowView = Backbone.View.extend({
    
        initialize : function()
        {
            // Initialize models
            
            this.settings = app.model.settings;
            
            // Create sub views
            
            var user = this.user = app.model.user;
            
            if(user.hasRole('ADMIN'))
            {
                this.settingsView    = new app.SettingsView   ({ el : this.$('.customer-chat-tab-content-settings-ui') });
                this.widgetThemeView = new app.WidgetThemeView({ el : this.$('.customer-chat-tab-content-widget-theme') });
            }
            
            this.chatTabView        = new app.ChatTabView       ({ el : this.$('#customer-chat-admin-chat') });
            this.operatorsView      = new app.OperatorsView     ({ el : this.$('#customer-chat-operators-tab') });
            this.cannedMessagesView = new app.CannedMessagesView({ el : this.$('#customer-chat-canned-messages-tab') });
            this.historyView        = new app.HistoryView       ({ el : this.$('#customer-chat-history') });
            this.tabsView           = new app.TabsView          ({ el : this.$('#customer-chat-admin-settings') });
            this.menuView           = new app.MenuView          ({ el : this.el, windowView : this });
            
            if(!user.hasRole('ADMIN'))
            {
                this.tabsView.removeTab(0); // Settings tab
                this.tabsView.removeTab(1); // Widget theme tab
                this.tabsView.removeTab(1); // Canned messages tab
                
                this.$('.customer-chat-tab-button.operators').html('Edit profile');
            }
            
            // -----
            
            // Keep updating the scroller when necessary
            
            this.$('#customer-chat-admin-settings .customer-chat-content-messages')
            
                .bind('show', function()
                {
                    $(window).trigger('resize');
                })
                
                .not('#customer-chat-history .customer-chat-content-messages')
                
                .mCustomScrollbar()
            ;
            
            // Overwrite the standard alert() function
            
            window.alert = function(message)
            {
                app.view.dialogs.message('Alert', message);
            };
            
            // Show the window
            
            this.$el.animate({ opacity : 1 }, { duration : 'slow'});
            
            // Handle global events
            
            this.listenTo(app, 'history.search', this.showHistory);
        },
        
        showHistory : function()
        {
            // Show the settings tab
            
            this.menuView.showSettings();
            
            // Show the history tab
            
            this.tabsView.showTab(this.user.hasRole('OPERATOR') ? 2 : 4);
        }
    });

})(window.Application, jQuery, window.chatConfig);