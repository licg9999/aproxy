module.exports = (function(assert, colors, instance, port, FOLDERNAMES, ds){

    var current;
    
    function update(){
        return new Promise(function(resolve, reject){
            Promise.all([ds.readJSONFile('data/rules.json'), ds.readJSONFile('data/remotes.json')]).then(function(data){

                var rules = data[0], remotes = data[1];

                var k, v, r;
                for(k in remotes){
                    v = remotes[k].split(':');

                    if(v[0] === '127.0.0.1'){
                        if(!v[1]){
                            v[1] = '80';
                        }
                        r = port.isRegistered(v[1]);
                        if(r){
                            reject();
                        }
                        assert.equal(r, false, ('Proxy port conflicts with local reverse proxy setting(' + remotes[k] + ')!').red);
                    }
                }

                current = instance(rules, { request: { remote: remotes } });
                resolve();
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
                    update().then(function(){
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

}(require('assert'), require('colors'), require('flex-combo-plus'), require('./port.js'), require('./consts/foldernames'), require('./ds')));
