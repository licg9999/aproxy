module.exports = (function(fs){
    return function(req, res){
        fs.read().done(function(rules){
            res.json({
                success: true,
                rules  : rules
            });
        }, function(){
            res.json({ success: false });
        });
    };
}(require('./fs.js')));