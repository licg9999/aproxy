module.exports = (function(Promise, instance, FOLDERNAMES, ds){

    var current;
    
    function update(){
        return new Promise(function(resolve, reject){
            Promise.all([ds.readJSONFile('data/rules.json'), ds.readJSONFile('data/remotes.json')]).done(function(data){

                var rules = data[0], remotes = data[1];

                var k, v;
                try{
                    current = instance(rules, { request: { remote: remotes } });
                    resolve();
                }catch(e){
                    for(k in remotes){
                        v = remotes[k];
                        if(v === '127.0.0.1'){
                            delete remotes[k];
                        }
                    }
                    ds.writeJSONFile('data/remotes.json', remotes).done(reject, reject);
                }
            }, reject);
        });
    }
    
    var queue = [];

    return {
        process: function(req, res){
            if(current){
                current(req, res);
            }else {
                if(queue.length === 0){
                    update().done(function(){
                        var args;
                        while(args = queue.shift()){
                            current(args[0], args[1]);
                        }
                    });
                }
                queue.push([req, res]);
            }
        },
        update: update
    };

}(require('promise'), require('flex-combo-plus'), require('./consts/foldernames'), require('./ds')));
