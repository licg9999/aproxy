define(function(require, exports, module){
    
    var template = require('template'),
        overlay  = require('overlay'),
        io       = require('io');
    
    // 导出通用方法
    exports = module.exports = structure([
        function(ths, cfg){
            ths.alias('add');
            return function(values, setEnabled){
                values = values || {};
                
                var $template = $('#' + cfg.$itemList.attr('data-template-id'));
    
                cfg.$itemList.prepend($template.html());

                var $item = cfg.$itemList.children().first();

                $item.attr('data-hbs-values', JSON.stringify(values));

                template.process($item);
                
                if(values.disabled){
                    $item.addClass('disabled');
                }
                
                $item.fadeIn({
                    complete: function(){
                        ths.check();
                    }
                });
                
                if(setEnabled){
                    ths.setEnable($item, $item.find(cfg.selectors.triggers.setEnable));
                }
            };
        },
        
        function(ths, cfg){
            ths.alias('check');
            return function($item){
                var $tipEmpty = cfg.$itemList.children('li.tip.empty');
                
                if(cfg.$itemList.children('li').length <= 1){
                    
                    $tipEmpty.fadeIn();
                }else{
                    $tipEmpty.fadeOut();
                }
            };
        },
        
        function(ths, cfg){
            ths.alias('remove');
            return function($item){
                $item.fadeOut({
                    complete: function(){
                        $item.remove();
                
                        ths.check();
                    }
                });
            };
        },
        
        function(ths, cfg){
            ths.alias('setEnable');
            return function($item, $set){
                $item.find('.from input[type=text]').prop('disabled', false).focus();
                $item.find('.to input[type=text]').prop('disabled', false);
                $set.removeClass('enable').addClass('disable').text($set.attr('data-disable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('setDisable');
            return function($item, $set){
                $item.find('.from input[type=text]').prop('disabled', true).focus();
                $item.find('.to input[type=text]').prop('disabled', true);
                $set.addClass('enable').removeClass('disable').text($set.attr('data-enable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('disEnable');
            return function($item, $dis){
                $item.removeClass('disabled');
                $dis.removeClass('enable').addClass('disable').removeClass('unimportant').text($dis.attr('data-disable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('disDisable');
            return function($item, $dis){
                $item.addClass('disabled');
                $dis.addClass('enable').removeClass('disable').addClass('unimportant').text($dis.attr('data-enable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('priorityUp');
            return function($item){
                var $prev = $item.prev('li');
                
                if($prev.length > 0 && !$prev.hasClass('tip')){
                    $item.insertBefore($prev);
                }
            };
        },
        
        function(ths, cfg){
            ths.alias('priorityDown');
            return function($item){
                var $next = $item.next('li');
                
                if($next.length > 0 && !$next.hasClass('tip')){
                    $item.insertAfter($next);
                }
            };
        },
        
        function(ths, cfg){
            cfg.$itemList.delegate(cfg.selectors.triggers.remove, 'click', function(e){
                var $item = $(e.currentTarget).parents('li');
                ths.remove($item);
            });
            
            cfg.$itemList.delegate(cfg.selectors.triggers.setEnable, 'click', function(e){
                var $set  = $(e.currentTarget),
                    $item = $set.parents('li');
                
                ths.setEnable($item, $set);
            });
            
            cfg.$itemList.delegate(cfg.selectors.triggers.setDisable, 'click', function(e){
                var $set  = $(e.currentTarget),
                    $item = $set.parents('li');
                
                ths.setDisable($item, $set);
            });
            
            cfg.$itemList.delegate(cfg.selectors.triggers.disEnable, 'click', function(e){
                var $dis  = $(e.currentTarget),
                    $item = $dis.parents('li');
                
                ths.disEnable($item, $dis);
            });
            
            cfg.$itemList.delegate(cfg.selectors.triggers.disDisable, 'click', function(e){
                var $dis  = $(e.currentTarget),
                    $item = $dis.parents('li');
                
                ths.disDisable($item, $dis);
            });
            
            cfg.$itemList.delegate(cfg.selectors.triggers.priorityUp, 'click', function(e){
                var $item = $(e.currentTarget).parents('li');
                ths.priorityUp($item);
            });
            
            cfg.$itemList.delegate(cfg.selectors.triggers.priorityDown, 'click', function(e){
                var $item = $(e.currentTarget).parents('li');
                ths.priorityDown($item);
            });
        }
    ], {
        $itemList: $('body > .body > .rules > .items'),
        
        selectors: {
            triggers: {
                remove    : 'button.remove',
                setEnable : 'button.set.enable',
                setDisable: 'button.set.disable',
                disEnable : 'button.dis.enable',
                disDisable: 'button.dis.disable',
                priorityUp: 'button.priority.up',
                priorityDown: 'button.priority.down'
            }
        },
    });

    // 弹出层逻辑
    structure([
        function(ths, cfg){
            
            function close(e){
                overlay.closeDefault(e);
            }
            
            overlay.delegate(cfg.selectors.overlay.triggers.yes, 'click', function(e){
                var $name = overlay.find(cfg.selectors.overlay.inputs.name),
                    name  = $name.val(),
                    $tip  = $name.next('.tip'),
                    tips  = $.parseJSON($tip.attr('data-tips'));
                
                if(name.length === 0){
                    
                    $tip.addClass('error');
                    $tip.html(tips.empty);
                }else{
                
                    close(e);
                    exports.add({
                        name: name
                    }, true);
                }
            });
            
            overlay.delegate(cfg.selectors.overlay.triggers.no, 'click', close);
            
            $(cfg.selectors.triggers.add).on('click', function(e){
                
                overlay.show(0, close, function(){
                    
                    var $name = overlay.find(cfg.selectors.overlay.inputs.name);
                    $name.focus();
                    
                    var $tip  = $name.next('.tip');
                    $tip.attr('class', 'tip');
                    $tip.html('');
                });
                
            });
        }
    ], {
        selectors: {
            triggers: {
                add: 'body > .body > .rules > button.add'
            },
            overlay: {
                triggers: {
                    yes : '.add .yes',
                    no  : '.add .no'
                },
                inputs  : {
                    name: '.add input[data-name]'
                }
            }
        }
    });
});