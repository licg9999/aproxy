module.exports = (function(fs){
    return function(req, res){
        var rule = {
            name: req.param('name', ''),
            from: req.param('from', ''),
            to  : req.param('to', ''),
            disabled: req.param('disabled', false)
        };
        rule.disabled = (typeof rule.disabled === 'string')? (rule.disabled === 'true'): !!rule.disabled;
        
        if(!rule.name){
            res.json({ success: false });
            
        }else{
            fs.read().done(function(rules){
                
                rules.unshift(rule);
                
                fs.write(rules).done(function(){

                    res.json({ success: true, index: 0 });

                }, function(){

                    res.json({ success: false });
                });

            }, function(){

                res.json({ success: false });
            });
        }
    };
}(require('./fs')));