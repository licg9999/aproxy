(function(express){
    
    var server = express();
    
    server.use('/', express.static(__dirname + '/web'));
    
    server.use(function(req, res, nex){
        require('./fns' + req.path)(req, res);
    });
    
    server.listen(10000);
    
    
}(require('express')));