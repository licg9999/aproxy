module.exports = (function(fs){
    return function(req, res){
        var rule = {
            name: req.param('name', ''),
            from: req.param('from', ''),
            to  : req.param('to', ''),
            disabled: !!req.param('disabled', false)
        };
        
        if(!rule.name){
            res.json({ success: false });
            
        }else{
            fs.read().done(function(rules){

                rules.push(rule);

                fs.write(rules).done(function(){

                    res.json({ success: true });

                }, function(){

                    res.json({ success: false });
                });

            }, function(){

                res.json({ success: false });
            });
        }
    };
}(require('./fs')));