(function(http, https, fs, express, instance, port, FOLDERNAMES){
    
    var portP = +process.argv[2] || 80,
        portS = +process.argv[3] || 443,
        portC = +process.argv[4] || 9999;

    http.createServer(function(req, res){ 
        instance.process(req, res); 
    }).listen(portP);
    port.register(portP);
    

    https.createServer({
        key : fs.readFileSync(FOLDERNAMES.PROJECT + 'ssl/aproxy.key'),
        cert: fs.readFileSync(FOLDERNAMES.PROJECT + 'ssl/aproxy.crt')
    }, function(req, res){
        instance.process(req, res);
    }).listen(portS);
    port.register(portS);
    

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
    port.register(portC);

    instance.update().done(function(){
        console.log('Started successfully. Stop by ^C'.green);
    });
    
}(require('http'), require('https'), require('fs'), require('express'), 
  require('./instance.js'), require('./port.js'), require('./consts/foldernames.js')));
