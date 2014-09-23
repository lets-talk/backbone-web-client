//==============================================================================
//
//  Single chat message
//
//==============================================================================

(function(app, config)
{
    app.MessageModel = Backbone.Model.extend({

        defaults : {
            
            author       : '',
            content      : '',
            toAuthor     : 'all',
            toAuthorMail : '',
            avatar       : ''
        },

        initialize : function(attributes, options)
        {
            this.options = options || {};
            
            // Initialize fields if stored as server-side data

            if(attributes)
            {
                if(attributes.datetime && typeof attributes.datetime === 'string')
                {
                    this.set('time', new Date(attributes.datetime.replace(/-/g,"/")));
                }

                if(typeof attributes.from_user_info === 'string' && attributes.from_user_info !== 'all')
                {
                    try      { attributes.from_user_info = JSON.parse(attributes.from_user_info); }
                    catch(e) { /* Do nothing... */}
                }
                
                if(typeof attributes.from_user_info === 'object')
                {
                    var fromUser = attributes.from_user_info;
                    
                    this.fromUser = fromUser;
                    
                    if(this.get('author').length === 0) this.set('author',     fromUser.name);
                    if(!this.has('authorMail'))         this.set('authorMail', fromUser.mail);
                }
                
                if(typeof attributes.to_user_info === 'string' && attributes.to_user_info !== 'all')
                {
                    try      { attributes.to_user_info = JSON.parse(attributes.to_user_info); }
                    catch(e) { /* Do nothing... */}
                }
                
                if(typeof attributes.to_user_info === 'object')
                {
                    var toUser = attributes.to_user_info;
                    
                    this.toUser = toUser;
                    
                    this.set('toAuthor',     toUser.name);
                    this.set('toAuthorMail', toUser.mail);
                }

                if(typeof attributes.person === 'object')
                {
                    this.set('author', attributes.person.name)

                    if(this.get('avatar').length === 0)
                        this.set('avatar', attributes.person.avatar)
                }
                
                // ...
            }
        },
        
        getAge : function()
        {
            // Calculate how long ago the message was received (in seconds)
            
            var currentTime = Math.floor(new Date().getTime()       / 1000);
            //var messageTime = Math.floor(this.get('time').getTime() / 1000 - (this.options.localMessage ? 0 : config.serverTimeDifference));
            //var messageTime = Math.floor(this.get('time').getTime() / 1000 - config.serverTimeDifference);
            var messageTime = Math.floor(this.get('time').getTime() / 1000);
            
            //return Math.ceil(currentTime - messageTime);
            return Math.ceil(currentTime - messageTime);
        },
        
        getReadableName : function()
        {
            var name = this.get('author');
            
            return name.lastIndexOf('-') !== -1 ? name.slice(0, name.lastIndexOf('-')) : name;
        },
        
        getToUserReadableName : function()
        {
            var name = this.get('toAuthor');
            
            return name.lastIndexOf('-') !== -1 ? name.slice(0, name.lastIndexOf('-')) : name;
        },
        
        getTalkName : function()
        {
            var toName = this.get('toAuthor');
            
            return this.getReadableName() + (toName ? '/' + (toName.lastIndexOf('-') !== -1 ? toName.slice(0, toName.lastIndexOf('-')) : toName) : '');
        }
    });

})(window.Application, window.chatConfig);