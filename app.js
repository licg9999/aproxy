(function(express){
    
    var app = express();
    
    app.use('/', express.static(__dirname + '/web'));
    
    app.listen(8080);
    
}(require('express')));