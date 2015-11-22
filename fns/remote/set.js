module.exports = (function(port, fs){
    return function(req, res){
        var hostname = req.param('hostname', ''),
            ipaddress= req.param('ipaddress', '');
        
        if(!hostname || !ipaddress){
            res.json({ success: false });

        }else{
            var ipaddressPars = ipaddress.split(':');
            ipaddressPars[1] = ipaddressPars[1]? +ipaddressPars[1]: 80;

            if(ipaddressPars[0] === '127.0.0.1' && port.isRegistered(ipaddressPars[1])){
                res.json({ success: false });

            }else {
                fs.read().then(function(remotes){
                    remotes[hostname] = ipaddress;
                    fs.write(remotes).then(function(){
                        res.json({ success: true });
                    }, function(){
                        res.json({ success: false });
                    });
                }, function(){
                    res.json({ success: false });
                });
            }
        }
    };
}(require('../../port.js'), require('./fs.js')));
