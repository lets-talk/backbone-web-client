//==============================================================================
//
//  Inserts the chat widget into a web page
//
//==============================================================================

(function()
{
    /*!
     * contentloaded.js
     */
    function contentLoaded(c,h){var b=false,g=true,j=c.document,i=j.documentElement,m=j.addEventListener?"addEventListener":"attachEvent",k=j.addEventListener?"removeEventListener":"detachEvent",a=j.addEventListener?"":"on",l=function(n){if(n.type=="readystatechange"&&j.readyState!="complete"){return}(n.type=="load"?c:j)[k](a+n.type,l,false);if(!b&&(b=true)){h.call(c,n.type||n)}},f=function(){try{i.doScroll("left")}catch(n){setTimeout(f,50);return}l("poll")};if(j.readyState=="complete"){h.call(c,"lazy")}else{if(j.createEventObject&&i.doScroll){try{g=!c.frameElement}catch(d){}if(g){f()}}j[m](a+"DOMContentLoaded",l,false);j[m](a+"readystatechange",l,false);c[m](a+"load",l,false)}};
    // Utils
    function addListener(b,a,c){if(b.addEventListener){b.addEventListener(a,c,false);return true}else{if(b.attachEvent){return b.attachEvent("on"+a,c)}else{a="on"+a;if(typeof b[a]==="function"){c=(function(d,e){return function(){d.apply(this,arguments);e.apply(this,arguments)}})(b[a],c)}b[a]=c;return true}}return false}function getWindowWidth(){return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth}function getWindowHeight(){return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}function getWindowScrollY(){return window.scrollY||window.pageYOffset||document.documentElement.scrollTop};
    
    // -----
    
    contentLoaded(window, function()
    {
        var iframe = document.createElement('iframe');

        var HEADER_HEIGHT      = <?php echo $vars['ui']['headerHeight'] ?>;
        var MOBILE_BREAKPOINT  = <?php echo $vars['ui']['mobileBreakpoint'] ?>;
        var MOBILE_BUTTON_SIZE = 55;
        
        iframe.id               = 'customer-chat-iframe';
        iframe.src              = 'http://letstalk.asheschile.com<?php echo $app->path("Widget:iframeContent") ?>&domain=' + document.domain;
        iframe.border           = 0;
        iframe.marginwidth      = 0;
        iframe.marginWidth      = 0;
        iframe.marginheight     = 0;
        iframe.marginHeight     = 0;
        iframe.frameBorder      = 0;
        iframe.outline          = 'none';
        iframe.style.display    = 'none';
        iframe.style.background = 'transparent';
        iframe.style.border     = 'none';
        iframe.style.outline    = 'none';
        iframe.style.position   = 'fixed';
        iframe.style.zIndex     = 999999;
        iframe.style.overflow   = 'hidden';
        iframe.style.bottom     = '';
        iframe.style.bottom     = -(<?php echo $vars['ui']['widgetHeight'] ?> - HEADER_HEIGHT) + 'px';
        iframe.style.right      = '<?php echo $vars['ui']['widgetOffset'] ?>px';
        iframe.style.width      = '<?php echo $vars['ui']['widgetWidth'] ?>px';
        iframe.style.height     = '<?php echo $vars['ui']['widgetHeight'] ?>px';
        iframe.style.margin     = 0;
        iframe.style.padding    = 0;
        
        // Responsiveness support
        
        var mobileStyles = {

            position  : 'absolute',
            width     : MOBILE_BUTTON_SIZE + 'px',
            height    : MOBILE_BUTTON_SIZE + 'px',
            top       : '',
            bottom    : '',
            right     : 0
        };
        
        var state          = 'desktop';
        var originalStyles = {};
        var widgetHtml;
        
        addListener(iframe, 'load', function()
        {
            widgetHtml = (iframe.contentWindow.document || iframe.contentDocument).getElementsByTagName('html')[0];
            
            addListener(window, 'resize', updateState);
            addListener(window, 'scroll', positionWidget);
            
            updateState();
        });
        
        // -----
        
        document.body.appendChild(iframe);
        
        // -----
        
        // Helper functions

        function updateState()
        {
            if     (state !== 'mobile'  && getWindowWidth() <  MOBILE_BREAKPOINT) setMobileState();
            else if(state !== 'desktop' && getWindowWidth() >= MOBILE_BREAKPOINT) setDesktopState();
            
            positionWidget();
        }

        function positionWidget()
        {
            if(getWindowWidth() < MOBILE_BREAKPOINT)
            {
                var viewportBottom = getWindowScrollY() + getWindowHeight();

                iframe.style.top = (viewportBottom - MOBILE_BUTTON_SIZE) + 'px';
            }
        }

        function setMobileState()
        {
            state = 'mobile';

            for(var key in mobileStyles) originalStyles[key] = iframe.style[key];
            for(var key in mobileStyles) iframe.style[key]   = mobileStyles[key];

            widgetHtml.className = 'mobile-widget';

            positionWidget();
        }

        function setDesktopState()
        {
            state = 'desktop';

            for(var key in originalStyles) iframe.style[key] = originalStyles[key];

            widgetHtml.className = '';
        }
    });
})();