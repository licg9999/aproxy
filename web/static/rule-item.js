define(function(require, exports, module){
    
    var template = require('template'),
        overlay  = require('overlay'),
        io       = require('io');
    
    exports = module.exports = structure([
        function(ths, cfg){
            var setting = false;
            ths.alias('isSetting');
            return function(b){
                if(arguments.length > 0){
                    setting = !!b;
                    if(!setting){
                        ths.isAdding(b);
                    }
                }else{
                    return setting;
                }
            };
        },
        
        function(ths, cfg){
            var adding = false;
            ths.alias('isAdding');
            return function(b){
                if(arguments.length > 0){
                    adding = !!b;
                }else{
                    return adding;
                }
            };
        },
        
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
                    ths.isAdding(true);
                    ths.setEnable($item, $item.find(cfg.selectors.triggers.setEnable));
                }
            };
        },
        
        function(ths, cfg){
            ths.alias('load');
            return function(){
                io.json(cfg.urls.load, function(data){
                    console.log(data);
                });
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
                if(ths.isSetEnabled($item)){
                    ths.isSetting(false);
                }
                
                $item.fadeOut({
                    complete: function(){
                        $item.remove();
                
                        ths.check();
                    }
                });
            };
        },

        function(ths, cfg){
            ths.alias('isSetEnabled');
            return function($item){
                return !$item.find('.from input[type=text]').prop('disabled');
            };
        },
        
        function(ths, cfg){
            ths.alias('setEnable');
            return function($item, $set){
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
                ths.isSetting(true);
                $item.find('.from input[type=text]').prop('disabled', false).focus();
                $item.find('.to input[type=text]').prop('disabled', false);
                $set.removeClass('enable').addClass('disable').text($set.attr('data-disable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('setDisable');
            return function($item, $set){
                ths.isSetting(false);
                
                var $from = $item.find('.from input[type=text]'),
                    $to   = $item.find('.to input[type=text]');
                
                io.json()
                
                $from.prop('disabled', true);
                $to.prop('disabled', true);
                $set.addClass('enable').removeClass('disable').text($set.attr('data-enable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('disEnable');
            return function($item, $dis){
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
                $item.removeClass('disabled');
                $dis.removeClass('enable').addClass('disable').removeClass('unimportant').text($dis.attr('data-disable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('disDisable');
            return function($item, $dis){
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
                $item.addClass('disabled');
                $dis.addClass('enable').removeClass('disable').addClass('unimportant').text($dis.attr('data-enable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('priorityUp');
            return function($item){
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
                var $prev = $item.prev('li');
                
                if($prev.length > 0 && !$prev.hasClass('tip')){
                    $item.insertBefore($prev);
                }
            };
        },
        
        function(ths, cfg){
            ths.alias('priorityDown');
            return function($item){
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
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
        },
        
        function(ths, cfg){
            var close = overlay.getCloseHandler();
            
            overlay.delegate(cfg.selectors.overlay.triggers.yes, 'click', function(e){
                var $name = overlay.find(cfg.selectors.overlay.inputs.name),
                    $tip  = $name.next('.tip');
                
                if($name.val().length === 0){
                    $tip.addClass('error');
                    $tip.html(cfg.tips.name.empty);
                    $name.select();
                }else{
                    close(e);
                    ths.add({
                        name: $name.val()
                    }, true);
                }
            });
            
            overlay.delegate(cfg.selectors.overlay.triggers.no, 'click', close);
            
            $(cfg.selectors.triggers.add).on('click', function(e){
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
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
        $itemList: $('body > .body > .rules > .items'),
        
        selectors: {
            triggers: {
                add       : '.rules > button.add',
                
                remove    : 'button.remove',
                setEnable : 'button.set.enable',
                setDisable: 'button.set.disable',
                disEnable : 'button.dis.enable',
                disDisable: 'button.dis.disable',
                priorityUp: 'button.priority.up',
                priorityDown: 'button.priority.down'
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
        },
        tips: {
            setting: '请先填写完当前编辑的规则',
            name: {
                empty: '规则名称不能为空'
            }
        },
        urls: {
            load: '/rule/load'
        }
    });
});