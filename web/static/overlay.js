define(function(require, exports, module){
    module.exports = structure([
        function(ths, cfg){
            ths.alias('delegate');
            
            return function(selector, event, handler){
                
                cfg.$wrapper.delegate(selector, event, handler);
            };
        },
        
        function(ths, cfg){
            ths.alias('find');
            
            return function(selector){
                return cfg.$wrapper.find(selector);
            };
        },
        
        function(ths, cfg){
            ths.alias('centralize');
            return function(){
                cfg.$stage.css({
                    'margin-left'   : '-' + cfg.$stage.width() / 2 + 'px',
                    'margin-top'    : '-' + cfg.$stage.width() / 2 + 'px'
                });
            };
        },
        
        function(ths, cfg){
            ths.alias('closeDefault');

            return function(e){
                cfg.$stage.fadeOut({
                    complete: function(){
                        cfg.$wrapper.html('');
                    }
                });
                cfg.$mask.fadeOut();
            };
        },
        
        function(ths, cfg){
            ths.alias('show');
            return function(idx, close, complete){
                
                close = close || ths.closeDefault;
                
                cfg.$wrapper.html(cfg.$itemList.children('li').eq(idx).html());
                
                cfg.$closer.off().on('click', close);
                
                cfg.$mask.off().fadeIn({
                    complete: function(){
                        cfg.$mask.on('click', close);
                        if(complete){
                            complete();
                        }
                    }
                });
                
                cfg.$stage.fadeIn();
                
                ths.centralize();
            };
        }
    ], {
        $mask       : $('body > .overlay > .mask'),
        $itemList   : $('body > .overlay > .items'),
        $stage      : $('body > .overlay > .stage'),
        $closer     : $('body > .overlay > .stage > .closer'),
        $wrapper    : $('body > .overlay > .stage > .wrapper')
    });
});