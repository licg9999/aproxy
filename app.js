(function(http, fs, express, instance){
    
    http.createServer(function(req, res){ 
        instance.process(req, res); 
    }).listen(80);
    
    var server = express();
    server.use('/', express.static(__dirname + '/web'));
    server.use(function(req, res, nex){
        try{
            require('./fns' + req.path)(req, res);
        }catch(e){
            nex();
        }
    });
    server.listen(9999);
    
}(require('http'), require('fs'), require('express'), require('./instance')));