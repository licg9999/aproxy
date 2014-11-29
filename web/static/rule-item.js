define(function(require, exports, module){
    
    var template = require('template'),
        overlay  = require('overlay'),
        validator= require('validator'),
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
                
                if(values.disabled){
                    ths.disDisable($item, $item.find(cfg.selectors.triggers.disDisable), true);
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
                var i, n, r, 
                    rules;
                
                io.json(cfg.urls.load, function(data){
                    if(data.success){
                        rules = data.rules;
                        for(i = rules.length - 1; i >= 0; i--){
                            r = rules[i];
                            ths.add({
                                index: i,
                                name : r.name,
                                from : r.from,
                                to   : r.to,
                                disabled: r.disabled
                            });
                        }
                    }else {
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
                var $index = $item.find('.index');
                
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
                        index: $index.text()
                    }, function(data){
                        if(data.success){
                            done();
                            $item.nextAll().find('.index').each(function(){
                                var $self = $(this);
                                $self.html((+$self.html()) - 1);
                            });
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
                var $index= $item.find('.index'),
                    $name = $item.find('.name'),
                    $from = $item.find('.from input[type=text]'),
                    $to   = $item.find('.to input[type=text]');
                
                if(!validator.and([
                    validator.nonEmp($from, cfg.tips.from.nonEmp) &&
                    validator.maxLen($from, cfg.tips.from.maxLen, 512),
                    validator.nonEmp($to, cfg.tips.to.nonEmp) && 
                    validator.maxLen($to, cfg.tips.to.maxLen, 512)
                ])){
                    return false;
                }
                
                if(!validator.format($from, '', /^\/.*/)){
                    $from.val('/' + $from.val());
                }
                if(!validator.format($from, '', /.*\/$/)){
                    $from.val($from.val() + '/');
                }
                
                $to.val($to.val().replace(/\\/g, '/'));
                if(!validator.format($to, '', /^(\w:)?\/.*/)){
                    $to.val('/' + $to.val());
                }
                if(!validator.format($to, '', /.*\/$/)){
                    $to.val($to.val() + '/');
                }
                
                function done(){
                    $from.prop('disabled', true);
                    $to.prop('disabled', true);
                    $set.addClass('enable').removeClass('disable').text($set.attr('data-enable'));
                }
                
                if(ths.isAdding()){
                    io.json(cfg.urls.add, {
                        name: $name.text(),
                        from: $from.val(),
                        to  : $to.val()
                    }, function(data){
                        if(data.success){
                            $index.html(data.index);
                            $item.nextAll().find('.index').each(function(){
                                var $self = $(this);
                                $self.html((+$self.html()) + 1);
                            });
                            done();
                        }else{
                            overlay.alert(cfg.tips.addFail);
                        }
                    });
                }else {
                    io.json(cfg.urls.set, {
                        index: $index.text(),
                        from : $from.val(),
                        to   : $to.val()
                    }, function(data){
                        if(data.success){
                            done();
                        }else{
                            overlay.alert(cfg.tips.setFail);
                        }
                    });
                }
                
                ths.isSetting(false);
            };
        },
        
        function(ths, cfg){
            ths.alias('disEnable');
            return function($item, $dis){
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
                
                var $index = $item.find('.index');
                
                io.json(cfg.urls.set, {
                    index: $index.text(),
                    disabled: false
                }, function(data){
                    if(data.success){
                        $item.removeClass('disabled');
                        $dis.removeClass('enable').addClass('disable').removeClass('unimportant').text($dis.attr('data-disable'));
                    }else{
                        overlay.alert(cfg.tips.setFail);
                    }
                });
            };
        },
        
        function(ths, cfg){
            ths.alias('disDisable');
            return function($item, $dis, nowrite){
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
                
                function done(){
                    $item.addClass('disabled');
                    $dis.addClass('enable').removeClass('disable').addClass('unimportant').text($dis.attr('data-enable'));
                }
                
                var $index = $item.find('.index');
                
                if(nowrite){
                    done();
                }else {
                    io.json(cfg.urls.set, {
                        index: $index.text(),
                        disabled: true
                    }, function(data){
                        if(data.success){
                            done();
                        }else{
                            overlay.alert(cfg.tips.setFail);
                        }
                    });
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
                var $next = $item.next('li'),
                    temp;
                
                if($next.length > 0 && !$next.hasClass('tip')){
                    
                    io.json(cfg.urls.priorityDown, {
                        index: $item.find('.index').text()
                    }, function(data){
                        if(data.success){
                            $item.insertAfter($next);
                            temp = $next.find('.index').text();
                            $next.find('.index').html($item.find('.index').text());
                            $item.find('.index').html(temp);
                        }else {
                            overlay.alert(cfg.tips.priorityFail);
                        }
                    });
                }
            };
        },
        
        function(ths, cfg){
            ths.alias('priorityUp');
            return function($item){
                if(ths.isSetting()){
                    overlay.alert(cfg.tips.setting);
                    return;
                }
                var $prev = $item.prev('li'),
                    temp;
                
                if($prev.length > 0 && !$prev.hasClass('tip')){
                    
                    io.json(cfg.urls.priorityUp, {
                        index: $item.find('.index').text()
                    }, function(data){
                        if(data.success){
                            $item.insertBefore($prev);
                            temp = $prev.find('.index').text();
                            $prev.find('.index').html($item.find('.index').text());
                            $item.find('.index').html(temp);
                        }else {
                            overlay.alert(cfg.tips.priorityFail);
                        }
                    });
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
                var $self = $(e.currentTarget),
                    $name = overlay.find(cfg.selectors.overlay.inputs.name);
                
                if(validator.nonEmp($name, cfg.tips.name.nonEmp) && validator.maxLen($name, cfg.tips.name.maxLen, 32)){
                    $self.prop('disabled', true);
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
            setting     : '请先填写完当前编辑的规则',
            loadFail    : '加载失败',
            addFail     : '添加失败',
            setFail     : '修改失败',
            removeFail  : '删除失败',
            priorityFail: '优先级调整失败',
            name: {
                nonEmp: '规则名称不得为空',
                maxLen: '规则名称不得超过32字'
            },
            from: {
                nonEmp: '匹配URL不得为空',
                maxLen: '匹配URL不得超过512字'
            },
            to: {
                nonEmp: '目录Path不得为空',
                maxLen: '目录Path不得超过512字'
            }
        },
        urls: {
            load  : '/rule/load',
            add   : '/rule/add',
            set   : '/rule/set',
            remove: '/rule/remove',
            priorityDown: '/rule/priorityDown',
            priorityUp: '/rule/priorityUp'
        }
    });
});