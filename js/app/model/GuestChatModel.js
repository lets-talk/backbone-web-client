//==============================================================================
//
//  Chat model
//
//==============================================================================

(function(app, $, config, _)
{
    var GuestChatModel = app.GuestChatModel = Backbone.Model.extend({
    
        defaults : {
            
            name : 'anonymous',
            mail : '',
            authToken: 'mAmhZYjuiGvqbDoEsmUq',
            conversationID: '',
            email: 'guest@letsta.lk',
            guestID: '38',
            syncTime: ''
        },
        
        operatorsCache : {},
        
        lastMessages : [],
        
        lastTypingUpdate : 0,
        
        initialize : function()
        {
            // Handle chatting features

            this.set({syncTime: this.oldDate()});

            this.once('operators:online', this.manageConnection, this);
            
            this.on('messages:new', this.storeMessages,       this);
            this.on('messages:new', this.confirmMessagesRead, this);
        },

        oldDate: function() {
            var oldDate = moment(new Date(1970, 0, 1));
            return oldDate.format('YYYY-MM-DD\'T\'HH:mm:ss.SSSZ');
        },
        
        autoLogin : function()
        {
            // Check if user is already logged in
            
            var _this = this;
            
            $.post(config.isLoggedInPath, { info : JSON.stringify(config.info) }, function(data)
            {
                if(data.success)
                {
                    // Store the login data
                    
                    _this.set({ name : data.name, mail : data.mail, image : data.image });
                    
                    // Notify success
                    
                    _this.trigger('login:success');
                    
                    // Read previous messages if any
                    
                    $.get(config.lastMessagesPath, function(data)
                    {
                        if(data.success && data.messages.length > 0)
                        {
                            _this.trigger('messages:last', data.messages);
                        }
                    });
                }
                else
                {
                    // Notify about need to log in again
                    
                    _this.trigger('login:login');
                }
            });
        },
        
        login : function(input)
        {
            var _this = this;
            
            input.info = JSON.stringify(config.info);
            
            $.post(config.loginPath, input, function(data)
            {
                if(data.success)
                {
                    // Store the login data
                    
                    _this.set({ name : input.name, mail : input.mail, image : input.image });
                    
                    // Notify success
                    
                    _this.trigger('login:success');
                }
                else
                {
                    // Notify about need to log in again
                    
                    _this.trigger('login:error');
                }
            });
        },
        
        logout : function()
        {
            // Stop connection management
            
            if(this.connectionTimer) clearInterval(this.connectionTimer);
            
            // Inform the operator
            
            var _this = this;
            
            this.sendMessage(new app.MessageModel({ content : '[ user has closed the chat ]' }), function()
            {
                // Send a logout request
                
                $.post(config.logoutPath, function(data)
                {
                    if(data && data.success)
                    {
                        // Notify about successful log-out

                        _this.trigger('logout:success');
                    }
                    else
                    {
                        // Notify about log-out error

                        _this.trigger('logout:error');
                    }
                });
            });
            
            // Clear messages cache
            
            this.lastMessages = [];
            
            // Notify about logging out
            
            this.trigger('logout:init');
            
            // Check operators again
            
            this.once('operators:online', this.manageConnection, this);
        },

        newChat : function(input)
        {
            var _this = this;

            var tempInput = {
                issue: '',
                organization_id: config.organizationID,
                client_id: this.get('guestID')
            };

            $.post(config.basePath + sprintf(config.newChatPath, this.get('authToken')), tempInput, function(data)
            {
                _this.set({ name : input.name, mail : input.mail, image : input.image, conversationID: data.id });
                
                _this.trigger('login:success');
            });
        },
        
        checkOperators : function()
        {
            // Check if there's any operator on-line
            
            var _this = this;
            
            $.get(config.isOperatorOnlinePath, function(data)
            {
                if(data.success)
                {
                    // Notify about online operator(s)
                    
                    _this.trigger('operators:online');
                }
                else
                {
                    // Notify about no operator(s)
                    
                    _this.trigger('operators:online');
                }
            });
        },
        
        keepAlive : function()
        {
            // Send keep-alive request
            
            $.get(config.keepAlivePath);
        },
        
        updateTypingStatus : function()
        {
            // Get operator's ID
            
            var operatorId = this.lastOperator && this.lastOperator.id;
            
            if(operatorId)
            {
                // Send the request only once per given amount of time

                var time = (new Date()).getTime();

                if(this.lastTypingUpdate + GuestChatModel.POLLING_INTERVAL < time)
                {
                    this.lastTypingUpdate = time;

                    // Send typing status update request

                    $.post(config.updateTypingStatusPath, { secondUserId : operatorId, status : true });
                }
            }
        },
        
        getTypingStatus : function()
        {
            // Get operator's ID
            
            var operatorId = this.lastOperator && this.lastOperator.id;
            
            if(operatorId)
            {
                // Get typing status
                
                var _this = this;
                
                $.post(config.getTypingStatusPath, { ids : [ operatorId ] }, function(data)
                {
                    if(data.success && data.results[operatorId])
                    {
                        _this.trigger('operator:typing');
                    }
                });
            }
        },
        
        getMessages : function()
        {
            // Poll new messages data
            
            var _this = this;

            if (_this.get('conversationID') == '')
                return;
            
            $.get(config.basePath + sprintf(config.newMessagesPath, _this.get('authToken'), _this.get('syncTime'), _this.get('guestID'), config.organizationID), function(data)
            {
                // Check if there are any new messages
                if(data.length > 0)
                {
                    _.each(data, function(conversation)
                    {
                        if(conversation.id == _this.get('conversationID') && conversation.new_messages.length > 0)
                        {
                            //conversation.new_messages.authorType = 'operator';

                            var realMessages = $.grep(conversation.new_messages, function(message, index){
                                return message.person && (message.person.email != _this.get('email'))
                            });

                            if (realMessages.length > 0)
                                _this.trigger('messages:new', realMessages);    
                        }
                    });

                    // Collect operator(s) info

                    /*_this.loadOperatorsData(data, function()
                    {
                        // Notify about new messages
                        
                        data.authorType = 'operator';
                        
                        _this.trigger('messages:new', data);
                    });*/
                }
            });
        },
        
        confirmMessagesRead : function(data)
        {
            // Get first and last message IDs
            
            var data = {
                
                firstId : data[0].id,
                lastId  : data[data.length - 1].id
            };
            
            // Send the confirmation request
            
            $.post(config.markMessagesReadPath, data);
        },
        
        storeMessages : function(messages)
        {
            var _this = this;

            _.each(messages, function(message)
            {
                if (message.replied_on)
                    _this.set({syncTime: message.replied_on})  

                if(!message.created_at && message.time)
                    message.created_at = message.time.getTime();

                /*if (message.person)
                    message.author = message.person.name;*/
            });

            // Save the messages

            this.lastMessages = this.lastMessages.concat(messages);

            // Prepare the messages
            
            /*_.each(messages, function(message)
            {
                if(!message.datetime && message.time)
                {
                    message.datetime = message.time.getTime();
                }
            });
            
            // Store in the cookie
            
            var date    = new Date();
            var minutes = 10;
            
            date.setTime(date.getTime() + minutes * 60 * 1000);
            
            $.cookie('customer-chat-messages', JSON.stringify(this.lastMessages), { expires : date });
        },
        
        storeOperator : function(operator)
        {
            this.lastOperator = this.operatorsCache[operator.id] = operator;
            
            // Save the cookie
            /*
            var date    = new Date();
            var minutes = 15;
            
            date.setTime(date.getTime() + minutes * 60 * 1000);
            
            $.cookie('customer-chat-operators', JSON.stringify(this.operatorsCache), { expires : date });*/
        },
        
        loadOperatorsData : function(messages, callback)
        {
            var _this = this;
            
            var loadCount = 0;
            
            // Check if there's any message from a not known operator
            
            for(var i = 0; i < messages.length; i++)
            {
                var message = messages[i];
                
                if(!this.operatorsCache[message.from_id])
                {
                    // Load operator's info
                    
                    loadCount++;
                    
                    $.post(config.getOperatorPath, { id : message.from_id })
                    
                        .success(function(data)
                        {
                            if(data.success)
                            {
                                // Store the data

                                _this.storeOperator(data.user);
                            }
                        })
                        
                        .always(function()
                        {
                            loadCount--;

                            if(loadCount <= 0)
                            {
                                // Finish the operation

                                callback();
                            }
                        })
                    ;
                }
            }
            
            if(loadCount <= 0)
            {
                // Finish the operation
                
                callback();
            }
        },
        
        getOperatorName : function(id)
        {
            return this.operatorsCache[id] && this.operatorsCache[id].name;
        },
        
        sendMessage : function(message, callback)
        {
            if (this.get('conversationID') == '')
                return;

            // Prepare data

            var input = {
            
                content : message.get('content'),
                content_type : 'text/plain'
            };
            
            // Send message to the server
            
            var _this = this;
            
            $.post(config.basePath + sprintf(config.sendMessagePath, this.get('conversationID'), this.get('authToken')), input, function(data)
            {
                if(data.success)
                {
                    // Notify success
                    
                    _this.trigger('messages:sent');
                }
                else
                {
                    // Notify error
                    
                    _this.trigger('messages:sendError');
                }
                
                if(callback) callback(data);
            });
            
            // Store the message
            
            this.storeMessages([ message.attributes ]);
        },
        
        manageConnection : function()
        {
            var _this = this;
            
            this.connectionTimer = setInterval(function()
            {
                // New messages polling
                
                _this.getMessages();
                
                // Keeping connection alive
                
                _this.keepAlive();
                
                // Checking typing status
                
                _this.getTypingStatus();
                
                // Checking operator's availability
                
                _this.checkOperators();
            
            }, GuestChatModel.POLLING_INTERVAL);
        }
    },
    {
        POLLING_INTERVAL : 5000
    });

})(window.Application, jQuery, window.chatConfig, _);