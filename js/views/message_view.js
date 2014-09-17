window.MessageView = Backbone.View.extend({
	tagName: 'li',	
    model: Message,

    render: function() {
    	if (this.model.get('person').email == window.LetsTalkApp.client.get('userEmail'))
    		this.$el.addClass('self')
    	else
    		this.$el.addClass('other')

    	var html = '<div class="avatar"><img src="' + this.model.get('person').avatar + '" /></div>';
    	html += '<div class="message"><p>';

        if (this.model.isImage())
            html += '<img width="140" src="' + this.model.get('content') +'">';
        
        else
            html += this.model.get('content');
        
        html += '</p>';
    	html += '<time datetime="2009-11-13T20:00">' + this.model.get('person').name + ' - 51 min</time></div>';

    	this.$el.append(html);
    }
});