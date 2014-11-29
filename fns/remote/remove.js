module.exports = (function(fs){
    return function(req, res){
        var hostname = req.param('hostname', '');
        if(!hostname){
            res.json({ success: false });
        }else{
            fs.read().done(function(remotes){
                if(delete remotes[hostname]){
                    fs.write(remotes).done(function(){
                        res.json({ success: true });
                    }, function(){
                        res.json({ success: false });
                    });
                }else{
                    res.json({ success: true });
                }
            }, function(){
                res.json({ success: false });
            });
        }
    };
}(require('./fs.js')));