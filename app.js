(function(http, https, fs, express, instance, FOLDERNAMES){
    
    var portP = +process.argv[2] || 80,
        portS = +process.argv[3] || 443,
        portC = +process.argv[4] || 9999;

    http.createServer(function(req, res){ 
        instance.process(req, res); 
    }).listen(portP);
    
    https.createServer({
        key : fs.readFileSync(FOLDERNAMES.PROJECT + 'data/aproxy.key'),
        cert: fs.readFileSync(FOLDERNAMES.PROJECT + 'data/aproxy.crt')
    }, function(req, res){
        instance.process(req, res);
    }).listen(portS);
    
    var server = express();
    server.use('/', express.static(__dirname + '/web'));
    server.use(function(req, res, nex){
        try{
            require('./fns' + req.path + '.js')(req, res);
        }catch(e){
            nex();
        }
    });
    server.listen(portC);
    
}(require('http'), require('https'), require('fs'), require('express'), 
  require('./instance.js'), require('./consts/foldernames.js')));
