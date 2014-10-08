//==============================================================================
//
//  Chat model
//
//==============================================================================

(function(app, $, config, _)
{
    var GuestChatModel = app.GuestChatModel = Backbone.Model.extend({
    
        defaults : {
            
            name : 'anonymus',
            mail : '',
            authToken: '',
            conversationID: '',
            email: '',
            guestID: '',
            syncTime: '',
            avatar: ''
        },
        
        operatorsCache : {},
        
        lastMessages : [],

        isGettingMessages: false,
        
        lastTypingUpdate : 0,
        
        initialize : function()
        {
            // Handle chatting features

            if($.cookie('customer-chat-guest-data'))
            {
                var data = JSON.parse($.cookie('customer-chat-guest-data'));
                this.set({ 
                    name : data.name,
                    mail : data.mail,
                    email : data.mail,
                    guestID : data.guestID,
                    authToken : data.authToken,
                    conversationID: data.conversationID,
                    syncTime : data.syncTime,
                    avatar : data.avatar
                });
            }
            else
            {
                this.set({syncTime: this.oldDate()});
            }

            if(this.checkGuestCache() && $.cookie('customer-chat-messages'))
            {
                console.log($.cookie('customer-chat-messages'));
                this.lastMessages = JSON.parse($.cookie('customer-chat-messages'));
            }

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

            //Checking cookies

            if (_this.checkGuestCache())
            {
                if(typeof this.get('conversationID') === 'number')
                {
                    _this.trigger('login:success');
                }
                else
                {
                    _this.trigger('login:welcome');
                }                
            }
            else
            {
                // Notify about need to log in again
                    
                _this.trigger('login:login');
            }
        },
        
        login : function(input)
        {
            var _this = this;
            
            input.info = JSON.stringify(config.info);
            input.email = input.mail;
            input.organization_id = window.environmentConfig.organizationID;
            input.type = 'client';

            $.ajax({
                type: "POST",
                url: config.basePath + config.guestLoginPath,
                data: input,
                success: function(data){

                    _this.saveDataAfterLogin(data);

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (XMLHttpRequest.status == 409)
                    {
                        _this.set({ email: input.mail, mail: input.mail });
                        _this.trigger('login:password-validation');
                    }

                    else
                        _this.trigger('login:error');
                    
                }
            });
        },

        passwordValidation: function(password)
        {
            var _this = this;

            $.ajax({
                type: "POST", 
                url: config.basePath + config.loginPath,
                data: {email: this.get('mail'), password: password},
                success: function(data){
                    
                    _this.saveDataAfterLogin(data);

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    _this.trigger('login:error');
                }
            })
        },
        
        endChat : function()
        {
            // Stop connection management
            
            if(this.connectionTimer) clearInterval(this.connectionTimer);
            
            // Inform the operator
            
            var _this = this;
            
            // Send a logout request

            if(typeof this.get('conversationID') === 'number')
            {
                $.ajax({
                    type: "PUT",
                    url: config.basePath + sprintf(config.updateChatPath, this.get('conversationID'), this.get('authToken')),
                    data: { status : 'Closed' },
                    success: function(data){

                        _this.clearCurrentChat();
                        
                        _this.trigger('login:welcome');
                        
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        _this.trigger('logout:error');
                    }
                });    
            }
            else
            {
                _this.clearCurrentChat();
                        
                _this.trigger('login:welcome');
            }
        },

        logout: function()
        {
            this.removeGuestCacheData();

            this.trigger('login:login');
        },

        newChat : function(message, inputElement)
        {
            if(!this.get('guestID') || this.get('guestID') == undefined)
                return;

            var _this = this;

            var tempInput = {
                issue: message.get('content'),
                organization_id: config.organizationID,
                client_id: this.get('guestID')
            };

            $(inputElement).prop('disabled', true);

            $.ajax({
                url: config.basePath + sprintf(config.newChatPath, this.get('authToken')),
                type: "POST",
                data: tempInput,
                success: function(data)
                {
                    _this.set({ conversationID: data.id });
                    _this.cacheGuestData();

                    $(inputElement).prop('disabled', false);

                    _this.resetMessagesCache();

                    //Updating user sync time

                    if (data.response_server_time)
                    {
                        _this.set({ syncTime: data.response_server_time })
                        _this.cacheGuestData();
                    }

                    _this.sendMessage(message);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $(inputElement).prop('disabled', false);
                }
            });
        },
        
        checkOperators : function()
        {
            // Check if there's any operator on-line
            
            var _this = this;

            _this.trigger('operators:online');

            /* USELESS CODE NOW 
            
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
            }); */
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

            if (typeof this.get('conversationID') !== 'number' || _this.isGettingMessages || _this.get('guestID') == undefined || !_this.get('guestID'))
                return;

            _this.isGettingMessages = true;
            
            $.ajax({
                type: "GET",
                url: config.basePath + sprintf(config.newMessagesPath, _this.get('authToken'), _this.get('syncTime'), _this.get('guestID'), config.organizationID),
                success: function(data){
                    
                    _this.isGettingMessages = false;

                    // Check if there are any new messages
                    if(data.length > 0)
                    {
                        _.each(data, function(conversation)
                        {
                            if(conversation.id == _this.get('conversationID') && conversation.new_messages.length > 0)
                            {
                                //conversation.new_messages.authorType = 'operator';

                                var realMessages = $.grep(conversation.new_messages, function(message, index){
                                    return message.person && (message.person.email != _this.get('mail'))
                                });

                                if (realMessages.length > 0)
                                    _this.trigger('messages:new', realMessages);    
                            }
                        });
                    }                    
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    _this.isGettingMessages = false;
                }
            });
        },
        
        confirmMessagesRead : function(data)
        {
            // Get first and last message IDs
            
            /*var data = {
                
                firstId : data[0].id,
                lastId  : data[data.length - 1].id
            };*/
            
            // Send the confirmation request
            
            //$.post(config.markMessagesReadPath, data);
        },
        
        storeMessages : function(messages)
        {
            var _this = this;

            _.each(messages, function(message)
            {
                if (message.replied_on)
                {
                    _this.set({ syncTime: message.replied_on })
                    _this.cacheGuestData();
                }

                if(!message.datetime && message.time)
                    message.datetime = message.time.getTime();
                else
                    message.time = new Date();
                    message.datetime = message.time.getTime();
            });

            // Save the messages

            this.lastMessages = this.lastMessages.concat(messages);
            
            // Store in the cookie
            
            var date = new Date();
            
            date.setTime(date.getTime() + 10 * 60 * 1000);
            
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
        
        checkMessages: function()
        {
            
        },

        sendMessage : function(message, callback)
        {
            if(typeof this.get('conversationID') !== 'number')
                return;

            // Prepare data

            var input = {
            
                content : message.get('content'),
                content_type : 'text/plain'
            };
            
            // Send message to the server
            
            var _this = this;
            
            $.ajax({
                type: "POST",
                url: config.basePath + sprintf(config.sendMessagePath, this.get('conversationID'), this.get('authToken')),
                data: input,
                success: function(data){
                    
                    //Updating user sync time

                    if (data.created_at)
                    {
                        _this.set({ syncTime: data.created_at })
                        _this.cacheGuestData();
                    }   

                    message.set('conversationID', _this.get('conversationID'));
                    _this.storeMessages([ message.attributes ]);

                    // Notify success
                    
                    _this.trigger('messages:sent');
                    
                    if(callback) callback(data);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    _this.trigger('messages:sendError');
                }
            });
            
            // Store the message
            
            //this.storeMessages([ message.attributes ]);
        },
        
        manageConnection : function()
        {
            var _this = this;
            
            this.connectionTimer = setInterval(function()
            {
                // New messages polling
                
                _this.getMessages();
                
                // Keeping connection alive
                
                //_this.keepAlive();
                
                // Checking typing status
                
                //_this.getTypingStatus();
                
                // Checking operator's availability
                
                //_this.checkOperators();
            
            }, GuestChatModel.POLLING_INTERVAL);
        },

        resetMessagesCache: function()
        {
            this.lastMessages = [];
            $.removeCookie('customer-chat-messages');
        },

        saveDataAfterLogin: function(data)
        {
            this.set({ 
                name : data.person.name,
                mail : data.person.email,
                email : data.person.email,
                authToken: data.token,
                guestID: data.person.id,
                avatar: data.person.avatar
            });

            this.cacheGuestData();

            this.trigger('login:success');
        },

        clearCurrentChat: function()
        {
            // Clear guest data cache

            $.removeCookie('customer-chat-messages');
            
            // Clear messages cache
            
            this.resetMessagesCache();

            this.set({conversationID: ''});

            // Check operators again
                    
            //_this.once('operators:online', this.manageConnection, this);
        },

        checkGuestCache: function()
        {
            return $.cookie('customer-chat-guest-data');
        },

        cacheGuestData: function()
        {
            var _this = this;

            var date = new Date();
            date.setTime(date.getTime() + 10 * 60 * 1000);

            var data = {
                name: _this.get('name'),
                mail: _this.get('mail'),
                email: _this.get('mail'),
                guestID: _this.get('guestID'),
                authToken: _this.get('authToken'),
                conversationID: _this.get('conversationID'),
                syncTime: _this.get('syncTime'),
                avatar: _this.get('avatar')
            }

            $.cookie('customer-chat-guest-data', JSON.stringify(data), { expires : date });
        },

        removeGuestCacheData: function()
        {
            $.removeCookie('customer-chat-guest-data');
        }
    },
    {
        POLLING_INTERVAL : 5000
    });

})(window.Application, jQuery, window.chatConfig, _);