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
            var showing = false;
            ths.alias('isShowing');
            return function(b){
                if(arguments.length > 0){
                    showing = !!b;
                }else {
                    return showing;
                }
            };
        },
        
        function(ths, cfg){            
            ths.alias('argumentsQueue');
            return [];
        },
        
        function(ths, cfg){
            ths.alias('apply2show');
            function show(index, close, after, before, maskCloseOff, closerNone){
                ths.isShowing(true);
                
                close = ths.getCloseHandler(close);
                
                cfg.$wrapper.html(cfg.$itemList.children('li').eq(index).html());
                
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
                    }
                });
                
                cfg.$stage.fadeIn({
                    complete: function(){
                        if(after){
                            after();
                        }
                    }
                });
                
                ths.centralize();
            }
            
            return function(args){
                show.apply(this, args);
            };
        },
        
        function(ths, cfg){
            ths.alias('getCloseHandler');

            return function(after){
                return function(){
                    cfg.$mask.fadeOut();
                    cfg.$stage.fadeOut({
                        complete: function(){
                            var args = ths.argumentsQueue.shift();
                            ths.isShowing(false);
                            if(after){
                                after();
                            }
                            cfg.$wrapper.html('');
                            if(args){
                                ths.apply2show(args);
                            }
                        }
                    });
                };
            };
        },
        
        function(ths, cfg){
            ths.alias('show');
            return function(){
                if(ths.isShowing()){
                    ths.argumentsQueue.push(arguments);
                }else{
                    ths.apply2show(arguments);
                }
            };
        },
        
        
        function(ths, cfg){
            
            ths.delegate(cfg.selectors.alert.triggers.yes, 'click', ths.getCloseHandler());
            
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
            var close = ths.getCloseHandler();
            
            ths.delegate(cfg.selectors.confirm.triggers.no, 'click', close);
            
            ths.alias('confirm');
            return function(tip, yes){
                yes = yes || close;
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
            var close = ths.getCloseHandler(),
                count = 0;
            
            ths.alias('progressBar');
            return function(b, cb){
                if(b){
                    if(count === 0){
                        ths.show(3, undefined, undefined, function(){
                            ths.find(cfg.selectors.progressBar.loader).shCircleLoader();
                        }, true, true);
                    }
                    count++;
                }else{
                    count--;
                    if(count === 0){
                        close();
                    }
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