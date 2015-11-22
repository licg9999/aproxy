module.exports = (function(fs){
    return function(req, res){
        var index = req.param('index', -1),
            temp;
        
        if(index <= 0){
            res.json({ success: false });
        }else {
            
            fs.read().then(function(rules){
                if(index >= rules.length){
                    res.json({ success: false });
                }else{
                    temp = rules[index];
                    rules[index] = rules[index - 1];
                    rules[index - 1] = temp;
                    fs.write(rules).then(function(){
                        res.json({ success: true });
                    }, function(){
                        res.json({ success: false });
                    });
                }
            });
        }
    };
}(require('./fs.js')));
