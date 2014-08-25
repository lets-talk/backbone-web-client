window.Client = Backbone.Model.extend({
	defaults: {
		userAuthToken: '',
		userEmail: '',
		userId: ''
	},
	setup: function(id, email, authToken){
		this.userId = id;
		this.userEmail = email;
		this.userAuthToken = authToken;
	},
	resetClient: function(){
		this.userId = "";
		this.userEmail = "";
		this.userAuthToken = "";	
	}
});