define(function(require, exports, module){
    
    var template = require('template'),
        overlay  = require('overlay'),
        validator= require('validator'),
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
                var $hostname  = $item.find('.hostname input[type=text]');
                
                function done(){
                    $item.fadeOut({
                        complete: function(){
                            $item.remove();

                            ths.check();
                        }
                    });
                }
                
                if(ths.isAdding()){
                    done();
                }else{
                    io.json(cfg.urls.remove, {
                        hostname: $hostname.val()
                    }, function(data){
                        if(data.success){
                            done();
                        }else{
                            overlay.alert(cfg.tips.removeFail);
                        }
                    });
                }
                
                if(ths.isSetEnabled($item)){
                    ths.isSetting(false);
                }
            };
        },

        function(ths, cfg){
            ths.alias('isSetEnabled');
            return function($item){
                return !$item.find('.ipaddress input[type=text]').prop('disabled');
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
                if(ths.isAdding()){
                    $item.find('.hostname input[type=text]').prop('disabled', false).focus();
                    $item.find('.ipaddress input[type=text]').prop('disabled', false);
                }else{
                    $item.find('.ipaddress input[type=text]').prop('disabled', false).focus();
                }
                $set.removeClass('enable').addClass('disable').text($set.attr('data-disable'));
            };
        },
        
        function(ths, cfg){
            ths.alias('setDisable');
            return function($item, $set){
                var $hostname  = $item.find('.hostname input[type=text]'),
                    $ipaddress = $item.find('.ipaddress input[type=text]');

                $hostname.val($hostname.val().replace(/^\s+/g, '').replace(/\s+$/g, ''));
                $ipaddress.val($ipaddress.val().replace(/^\s+/g, '').replace(/\s+$/g, ''));
                
                if(!validator.and([
                    validator.nonEmp($hostname, cfg.tips.hostname.nonEmp) && 
                    validator.maxLen($hostname, cfg.tips.hostname.maxLen, 128),
                    
                    validator.nonEmp($ipaddress, cfg.tips.ipaddress.nonEmp) &&
                    validator.maxLen($ipaddress, cfg.tips.ipaddress.maxLen, 21) &&
                    validator.format($ipaddress, cfg.tips.ipaddress.format, /^((\d{1,3}\.){3}\d{1,3})(\:\d{1,5})?$/)
                ])){
                    return false;
                }                
                
                ths.isSetting(false);
                io.json(cfg.urls.set, {
                    hostname : $hostname.val(),
                    ipaddress: $ipaddress.val()
                }, function(data){
                    if(data.success){
                        $hostname.prop('disabled', true);
                        $ipaddress.prop('disabled', true);
                        $set.addClass('enable').removeClass('disable').text($set.attr('data-enable'));
                    }else {
                        overlay.alert(cfg.tips.setFail);
                    }
                });
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
            
            $(cfg.selectors.triggers.add).on('click', function(e){
                exports.add({}, true);
            });
        }
        
        
    ], {
        $itemList: $('body > .body > .remotes > .items'),
        
        selectors: {
            triggers: {
                add: 'body > .body > .remotes > button.add',
                remove    : 'button.remove',
                setEnable : 'button.set.enable',
                setDisable: 'button.set.disable'
            }
        },
        tips: {
            setting   : '请先填写完当前编辑的远端信息',
            loadFail  : '加载失败',
            setFail   : '写入失败',
            removeFail: '删除失败',
            hostname  : {
                nonEmp: '主机名不得为空',
                maxLen: '主机名不得超过128字'
            },
            ipaddress : {
                nonEmp: 'IP地址不得为空',
                maxLen: 'IP地址不得超过21字',
                format: 'IP地址格式错误'
            }
        },
        urls: {
            load  : '/remote/load',
            set   : '/remote/set',
            remove: '/remote/remove'
        }
    });    
});
