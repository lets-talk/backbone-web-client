window.Client = Backbone.Model.extend({
	defaults: function() {
		return {
			userAuthToken: '',
			userEmail: '',
			userId: '',
			syncTime: 'oldDate'
		}
	},

	initialize: function() {
		if(this.exists()) {
			this.set({userId: $.cookie('userId')});
			this.set({userEmail: $.cookie('userEmail')});
			this.set({userAuthToken: $.cookie('userAuthToken')});
			this.set({syncTime: $.cookie('syncTime')});	
			console.log(this.toJSON());
		}
	},

	setup: function(id, email, authToken) {
		this.set({userId: id});
		this.set({userEmail: email});
		this.set({userAuthToken: authToken});
		this.set({syncTime: this.oldDate()});

		$.cookie('userAuthToken', authToken);
		$.cookie('userEmail', email);
		$.cookie('userId', id);
		$.cookie('syncTime', this.oldDate());
	},

	reset: function() {
		this.set({userId: ''});
		this.set({userEmail: ''});
		this.set({userAuthToken: ''});
		this.set({syncTime: this.oldDate()});

		$.removeCookie('authToken');
		$.removeCookie('userEmail');
		$.removeCookie('userId');
		$.removeCookie('syncTime');
	},

	exists: function() {
    	return typeof($.cookie('userAuthToken')) !== "undefined" && 
    		typeof($.cookie('userEmail')) !== "undefined" && 
    			typeof($.cookie('userId')) !== "undefined" && 
    				typeof($.cookie('syncTime')) !== "undefined";
    },

    oldDate: function() {
    	var oldDate = moment(new Date(1970, 0, 1));
    	return oldDate.format('YYYY-MM-DD\'T\'HH:mm:ss.SSSZ');
    }
});