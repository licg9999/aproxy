module.exports = (function(merge, fs){
    return function(req, res){
        var index = req.param('index', -1),
            value = JSON.parse(req.param('value', null));
        
        if(index < 0 || !value){
            res.json({ success: false });
        }else{
            fs.read().done(function(rules){
                if(index >= rules.length){
                    res.json({ success: false });
                }else{
                    merge.recursive(rules[index], value);
                    fs.write(rules).done(function(){
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
}(require('merge'), require('./fs')));