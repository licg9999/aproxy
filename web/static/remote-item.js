define(function(require, exports, module){
    
    var template = require('template'),
        overlay  = require('overlay'),
        io       = require('io');
    
    // 导出通用方法
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
            }
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
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
                
                values = values || {};
                
                var $template = $('#' + cfg.$itemList.attr('data-template-id'));
                
                cfg.$itemList.prepend($template.html());
                
                var $item = cfg.$itemList.children().first();
                
                $item.attr('data-hbs-values', JSON.stringify(values));
                
                template.process($item);
                
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
                    var k, v;
                    if(data.success){
                        for(k in data.remotes){
                            v = data.remotes[k];
                            ths.add({
                                hostname : k,
                                ipaddress: v
                            });
                        }
                    }else{
                        overlay.alert(cfg.tips.loadFail);
                    }
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
                return !$item.find('.hostname input[type=text]').prop('disabled')
            }
        },
        
        function(ths, cfg){
            ths.alias('setEnable');
            return function($item, $set){
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
                
                ths.isSetting(true);
                
                $item.find('.hostname input[type=text]').prop('disabled', false).focus();
                $item.find('.ipaddress input[type=text]').prop('disabled', false);
                $set.removeClass('enable').addClass('disable').text($set.attr('data-disable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('setDisable');
            return function($item, $set){
                ths.isSetting(false);
                
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
        },
        tips: {
            setting: '请填先写完当前编辑的远端信息',
            loadFail: '加载失败'
        },
        urls: {
            load: '/remote/load'
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