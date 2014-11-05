define(function(require, exports, module){
    var page = require('page');
    
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
                
                page.process($item);
                
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
                $item.find('.hostname input[type=text]').prop('disabled', false).focus();
                $item.find('.ipaddress input[type=text]').prop('disabled', false);
                $set.removeClass('enable').addClass('disable').text($set.attr('data-disable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('setDisable');
            return function($item, $set){
                $item.find('.hostname input[type=text]').prop('disabled', true).focus();
                $item.find('.ipaddress input[type=text]').prop('disabled', true);
                $set.addClass('enable').removeClass('disable').text($set.attr('data-enable'));
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
        }
    ], {
        $itemList: $('body > .body > .remotes > .items'),
        
        selectors: {
            triggers: {
                remove    : 'button.remove',
                setEnable : 'button.set.enable',
                setDisable: 'button.set.disable'
            }
        }
    });
    
    
    // 添加触发逻辑
    structure([
        function(ths, cfg){
            
            $(cfg.selectors.triggers.add).on('click', function(e){
                exports.add({}, true);
            });
        }
    ], {
        selectors: {
            triggers: {
                add: 'body > .body > .remotes > button.add'
            }
        }
    });
});