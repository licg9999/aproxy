(function(){
    var ports = [];

    module.exports = {
        register: function(port){
            var _self = this;
            port = +port;
            if(!_self.isRegistered(port)){
                ports.push(port);
            }
        },

        isRegistered: function(port){
            var registered = false;
            port = +port;
            ports.forEach(function(p, i){
                if(registered){
                    return;
                }
                if(port === p){
                    registered = true;
                }
            });
            return registered;
        }
    };
}());
