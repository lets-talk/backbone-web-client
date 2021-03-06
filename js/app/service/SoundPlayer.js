//==============================================================================
//
//  Sound player
//
//==============================================================================

(function(app, soundManager, config)
{
    var SoundPlayer = app.SoundPlayer = function()
    {
        // Dummy interface
        
        this.play = function(id) {};
        
        var soundsArr = [];
        
        this.addSounds = function(sounds)
        {
            soundsArr.push(sounds);
        };
        
        // Setup
        
        var _this = this;
        
        soundManager.setup({
        
            url : config.rootPath + 'swf/',
            
            onready : function()
            {
                // Expose functional interface
                
                _this.play = function(id)
                {
                    soundManager.play(id);
                };
                
                _this.addSounds = function(sounds)
                {
                    for(var id in sounds)
                    {
                        soundManager.createSound({

                            id : id,

                            url : config.rootPath + sounds[id],

                            autoLoad : true,
                            autoPlay : false,

                            volume   : 100
                        });
                    }
                };
                
                // Create sounds
                
                _this.addSounds({ 'message' : config.ui.messageSound });
                
                if(soundsArr.length > 0)
                {
                    for(var i = 0; i < soundsArr.length; i++) _this.addSounds(soundsArr[i]);
                }
            }
        });
    };

})(window.Application, soundManager, chatConfig);