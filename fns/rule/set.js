module.exports = (function(merge, fs){
    return function(req, res){
        var rule = {},
            index= req.param('index', -1),
            name = req.param('name'),
            from = req.param('from'),
            to   = req.param('to'),
            disabled = req.param('disabled');
        
        if(name !== undefined){     rule.name = name; }
        if(from !== undefined){     rule.from = from; }
        if(to !== undefined){       rule.to   = to;   }
        if(disabled !== undefined){
            rule.disabled = (typeof disabled === 'string')? (disabled === 'true'): !!disabled;
        }
        
        if(index < 0){
            res.json({ success: false });
        }else{
            fs.read().then(function(rules){
                if(index >= rules.length){
                    res.json({ success: false });
                }else{
                    merge.recursive(rules[index], rule);
                    fs.write(rules).then(function(){
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
}(require('merge'), require('./fs.js')));
