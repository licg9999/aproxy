module.exports = (function(fs, instance){
    var current;
    
    function readJSONFileSync(filename){
        return JSON.parse(fs.readFileSync(filename).toString());
    }
    
    function writeJSONFileSync(filename, object){
        fs.writeFileSync(filename, JSON.stringify(object));
    }
    
    function update(){
        // TODO
        var rules   = readJSONFileSync('./data/rules.json'),
            remotes = readJSONFileSync('./data/remotes.json');
        
        var k, v;
        try{
            current = instance(rules, { request: { remote: remotes } });
        }catch(e){
            for(k in remotes){
                v = remotes[k];
                if(v === '127.0.0.1'){
                    delete remotes[k];
                }
            }
            writeJSONFileSync('./data/remotes.json', remotes);
            throw e;
        }
    }
    update();
    
    return {
        process: function(req, res){
            current(req, res);
        },
        update: update
    };
}(require('fs'), require('flex-combo-plus')));
