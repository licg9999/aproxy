module.exports = (function(fs){
    return function(req, res){
        var hostname = req.param('hostname', ''),
            ipaddress= req.param('ipaddress', '');
        
        if(!hostname || !ipaddress){
            res.json({ success: false });
        }else{
            fs.read().done(function(remotes){
                if(!remotes[hostname]){
                    res.json({ success: false });
                }else{
                    remotes[hostname] = ipaddress;
                    fs.write(remotes).done(function(){
                        res.json({ success: true });
                    }, function(){
                        res.json({ success: false });
                    });
                }
            }, function(){
                res.json({ success: false });
            });
        }
    };
}(require('./fs')));