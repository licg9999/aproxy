(function(cfg){
    var global = cfg.global,
        rtname = cfg.rtname;
    
    /**
     * 特殊说明：在最后一个定义中传入true以表结束
     */
    var define = global.define;
    global.define = function(fn, ud){
        fn(cfg);
        if(ud){
            global.define = define;
        }
    };
}({
    global: window,
    rtname: 'structure'
}));

define(function(cfg){
    var hook = cfg.util = {};
    
    
    /* ==== 通用方法-类型判断 ==== */
    function isType0(type){
        return function(obj){
            return obj === type;
        };
    }
    function isType1(type) {
        return function(obj) {
            return typeof obj === type;
        };
    }
    function isType2(type) {
        return function(obj) {
            return {}.toString.call(obj) === '[object ' + type + ']';
        };
    }
    
    var isUndefined0 = isType0(undefined),
        isUndefined1 = isType1('undefined'),
        isUndefined2 = isType2('Undefined');
    hook.isUndefined = function(u){
        return isUndefined0(u) || isUndefined1(u) || isUndefined2(u);
    };

    var isNull0 = isType0(null),
        isNull2 = isType2('Null');
    hook.isNull = function(n){
        return isNull0(n) || isNull2(n);
    };
    
    var isTrue0    = isType0(true),
        isFalse0   = isType0(false),
        isBoolean1 = isType1('boolean'),
        isBoolean2 = isType2('Boolean');
    hook.isBoolean = function(b){
        return isTrue0(b) || isFalse0(b) || isBoolean1(b) || isBoolean2(b);
    };
    
    var isNumber1 = isType1('number'),
        isNumber2 = isType2('Number');
    hook.isNumber = function(n){
        return isNumber1(n) || isNumber2(n);
    };
    
    var isString1 = isType1('string'),
        isString2 = isType2('String');
    hook.isString = function(s){
        return isString1(s) || isString2(s);
    };
    
    var isFunction1 = isType1('function'),
        isFunction2 = isType2('Function');
    hook.isFunction = function(f){
        return isFunction1(f) || isFunction2(f);
    };
    
    /**
     * 除了undefined、boolean、number、string、function以外，都是object
     */
    var isObject1 = isType1('object'),
        isObject2 = isType2('Object');
    hook.isObject = function(o){
        return !hook.isUndefined(o) && !hook.isFunction(o) && (isObject1(o) || isObject2(o));
    };
    
    var isArray2 = Array.isArray || isType2('Array');
    hook.isArray = function(a){
        return isArray2(a);
    };
    
    
    /* ==== 通用方法-内需方法 ==== */
    hook.throwError = function(message){
        throw new Error(message);
    };
    
    function overwrite(tar, src, k){
        tar[k] = src[k];
    }
    function seen(k, tar){
        return tar.hasOwnProperty(k);
    }
    function seenwrite(tar, src, k){
        if(!seen(k, tar)){
            overwrite(tar, src, k);
        }
    }
    function augmentOverwriteDeeply(tar, src){
        var k;
        for(k in src){
            if(hook.isObject(src[k]) && !hook.isNull(src[k])){
                tar[k] = hook.isArray(src[k])? []: {};
                augmentOverwriteDeeply(tar[k], src[k]);
            }else{
                overwrite(tar, src, k);
            }
        }
    }
    function augmentSeenwriteDeeply(tar, src){
        var k, b;
        for(k in src){
            if(hook.isObject(src[k]) && !hook.isNull(src[k])){
                if(!seen(k, tar)){
                    tar[k] = hook.isArray(src[k])? []: {};
                    augmentSeenwriteDeeply(tar[k], src[k]);
                }
            }else{
                seenwrite(tar[k], src[k], k);
            }
        }
    }
    hook.augment = function(tar, src, ow, dp){
        if(!(hook.isObject(tar) && !hook.isNull(tar)) && !hook.isFunction(tar)){
            hook.throwError('arguments[0] should be non-null Object or Function');
        }
        if(!(hook.isObject(src) && !hook.isNull(src)) && !hook.isFunction(src)){
            hook.throwError('arguments[1] should be non-null Object or Function');
        }
        
        var k;
        if(ow && dp){
            augmentOverwriteDeeply(tar, src);
        }else if(ow && !dp){
            for(k in src){
                overwrite(tar, src, k);
            }
        }else if(!ow && dp){
            augmentSeenwriteDeeply(tar, src);
        }else{
            for(k in src){
                seenwrite(tar, src, k);
            }
        }
        return tar;
    };
    
});
define(function(cfg){
    var hook   = cfg,
        global = cfg.global,
        util   = cfg.util;
    
    /**
     * 用处：定义名字空间
     */
    hook.namespace = function(tar, name, src){
        var n = arguments.length;
        if(n < 2){
            util.throwError('arguments[0] and arguments[1] are required');
        }
        
        if(!util.isObject(tar)){
            tar = global;
        }
        
        if(!util.isString(name)){
            util.throwError('arguments[1] should be String');
        }
        
        if(tar[name]){
            util.throwError('there has been a ' + name + ' in given space');
        }else{
            return (tar[name] = src || {});
        }
    };
});
define(function(cfg){
    var global    = cfg.global,
        rtname    = cfg.rtname,
        util      = cfg.util,
        namespace = cfg.namespace,
        hook      = namespace(cfg, '_');
    
    
    hook.getThese = function(){
        var _self = [];
        
        var _aliases = [];
        _self.alias = function(noi){
            var i, n;

            if(util.isString(noi)){
                _aliases.push(noi);
            }

            if(util.isNumber(noi)){
                while(_aliases.length > 0){
                    _self[_aliases.shift()] = _self[noi];
                }
            }
        };
        
        return _self;
    };
    
    /**
     * 定位：用户使用时的初始化方法
     */
    hook.main = function(fns, cfg){
        var idx, n, ths;
        for(idx = 0, n = fns.length, ths = hook.getThese(); idx < n; idx++){
            ths.push(
                fns[idx](ths, cfg, idx)
            );
            ths.alias(idx);
        }
        return ths;
    };
    
    namespace(global, rtname, function(fns, cfg){
        var i, n, b;
        
        if(!util.isArray(fns)){
            util.throwError('arguments[0] should be Array');
        }else{
            for(b = true, i = 0, n = fns.length; b && i < n; i++){
                b = b && util.isFunction(fns[i]);
            }
            if(!b){
                util.throwError('arguments[0] should be Array<Function>');
            }
        }
        
        cfg = cfg || {};
        
        return hook.main(fns, cfg);
    });
});
define(function(cfg){
    var global      = cfg.global,
        rtname      = cfg.rtname,
        util        = cfg.util;
    
    util.augment(global[rtname], cfg);
}, true);