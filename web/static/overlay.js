define(function(require, exports, module){
    var template = require('template');
    
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
            return function(idx, close, after, before, maskCloseOff, closerNone){
                
                close = close || ths.closeDefault;
                
                cfg.$wrapper.html(cfg.$itemList.children('li').eq(idx).html());
                
                cfg.$closer.off().hide();
                if(!closerNone){
                    cfg.$closer.on('click', close).show();
                }
                
                if(before){
                    before();
                }
                
                cfg.$mask.off().fadeIn({
                    complete: function(){
                        if(!maskCloseOff){
                            cfg.$mask.on('click', close);
                        }
                        if(after){
                            after();
                        }
                    }
                });
                
                cfg.$stage.fadeIn();
                
                ths.centralize();
            };
        },
        
        
        function(ths, cfg){
            
            ths.delegate(cfg.selectors.alert.triggers.yes, 'click', ths.closeDefault);
            
            ths.alias('alert');
            return function(tip){
                ths.show(1, undefined, undefined, function(){
                    var $div = ths.find(cfg.selectors.alert.toString());
                    $div.attr('data-hbs-values', JSON.stringify({tip: tip}));
                    template.process($div);
                });
            };
        },
        
        
        function(ths, cfg){
            
            ths.delegate(cfg.selectors.confirm.triggers.no, 'click', ths.closeDefault);
            
            ths.alias('confirm');
            return function(tip, yes){
                yes = yes || ths.closeDefault;
                ths.show(2, undefined, function(){
                    ths.find(cfg.selectors.confirm.triggers.yes).off().on('click', function(){
                        yes();
                    });
                }, function(){
                    var $div = ths.find(cfg.selectors.confirm.toString());
                    $div.attr('data-hbs-values', JSON.stringify({tip: tip}));
                    template.process($div);
                });
            };
        },
        
        function(ths, cfg){
            ths.alias('progressBar');
            return function(b){
                if(b){
                    ths.show(3, undefined, undefined, function(){
                        ths.find(cfg.selectors.progressBar.loader).shCircleLoader();
                    }, true, true);
                }else{
                    ths.closeDefault();
                }
            };
        }
    ], {
        $mask       : $('body > .overlay > .mask'),
        $itemList   : $('body > .overlay > .items'),
        $stage      : $('body > .overlay > .stage'),
        $closer     : $('body > .overlay > .stage > .closer'),
        $wrapper    : $('body > .overlay > .stage > .wrapper'),
        selectors   : {
            alert: {
                triggers: {
                    yes: '.alert .yes'
                },
                toString: function(){
                    return '.alert';
                }
            },
            confirm: {
                triggers: {
                    yes: '.confirm .yes',
                    no : '.confirm .no'
                },
                toString: function(){
                    return '.confirm';
                }
            },
            progressBar: {
                loader: '.progressBar .loader',
                toString: function(){
                    return '.progressBar';
                }
            }
        }
    });
});