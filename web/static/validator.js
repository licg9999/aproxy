define(function(require, exports, module){
    
    function done($inp, tip){
        $inp.select().one('focusin keydown keyup', function(){
            $inp.next('.tip').removeClass('error').html('');
        }).next('.tip').addClass('error').html(tip);
    }
    
    module.exports = {
        is: function($inp, tip, test){
            test = test.call($inp, $inp.val());
            if(!test){
                done($inp, tip);
            }
            return test;
        },
        
        maxLen: function($inp, tip, len){
            return this.is($inp, tip, function(val){
                return val.length <= len;
            });
        },
        
        minLen: function($inp, tip, len){
            return this.is($inp, tip, function(val){
                return val.length >= len;
            });
        },
        
        nonEmp: function($inp, tip){
            return this.minLen($inp, tip, 1);
        },
        
        format: function($inp, tip, regexp){
            return this.is($inp, tip, function(val){
                return regexp.test(val);
            });
        },
        
        and: function(bs){
            var i, n;
            for(i = 0, n = bs.length; i < n; i++){
                if(!bs[i]){
                    return false;
                }
            }
            return true;
        },
        
        or: function(bs){
            var i, n;
            for(i = 0, n = bs.length; i < n; i++){
                if(bs[i]){
                    return true;
                }
            }
            return false;
        }
    };
});