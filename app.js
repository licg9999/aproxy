(function(express){
    
    var server = express();
    
    server.use('/', express.static(__dirname + '/web'));
    
    server.use(function(req, res, nex){
        try{
            require('./fns' + req.path)(req, res);
        }catch(e){
            nex();
        }
    });
    
    server.listen(9000);
    
    
}(require('express')));