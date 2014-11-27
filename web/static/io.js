define(function(require, exports, module){

    var overlay = require('overlay');
    
    module.exports = structure([
        function(ths, cfg){
            ths.alias('json');
            return function(url, data, success){
                if(arguments.length === 2){
                    success = data;
                }
                
                overlay.progressBar(true);
                $.ajax({
                    url    : url,
                    data   : data,
                    success: function(data){
                        overlay.progressBar(false);
                        success(data);
                    },
                    error  : function(){
                        overlay.alert('网络异常');
                    },
                    type   : 'GET',
                    cache  : false,
                });
            }
        }
    ]);
});