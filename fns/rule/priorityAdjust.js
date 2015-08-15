module.exports = (function(fs) {
    return function(req, res) {
        var sindex = +req.param('sindex', -1),
            tindex = +req.param('tindex', -1),
            temp, i;

        if (sindex < 0 || tindex < 0) {
            res.json({
                success: false
            });
        } else {

            fs.read().done(function(rules) {
                if (sindex > rules.length || tindex >= rules.length) {
                    res.json({
                        success: false
                    });
                } else {
                    if (sindex < tindex) {
                        temp = rules[sindex];
                        for (i = sindex; i < tindex; i++) {
                            rules[i] = rules[i + 1];
                        }
                        rules[tindex] = temp;
                    } else {
                        temp = rules[sindex];
                        for (i = sindex; i > tindex; i--) {
                            rules[i] = rules[i - 1];
                        }
                        rules[tindex] = temp;
                    }
                    fs.write(rules).done(function() {
                        res.json({
                            success: true
                        });
                    }, function() {
                        res.json({
                            success: false
                        });
                    });
                }
            });
        }
    };
}(require('./fs.js')));
