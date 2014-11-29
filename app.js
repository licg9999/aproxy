(function(http, fs, express, instance){
    
    var portP = process.argv[2] || 80,
        portC = process.argv[3] || 9999;
    
    http.createServer(function(req, res){ 
        instance.process(req, res); 
    }).listen(portP);
    
    var server = express();
    server.use('/', express.static(__dirname + '/web'));
    server.use(function(req, res, nex){
        try{
            require('./fns' + req.path)(req, res);
        }catch(e){
            nex();
        }
    });
    server.listen(portC);
    
}(require('http'), require('fs'), require('express'), require('./instance')));