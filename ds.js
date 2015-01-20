module.exports = (function(fs, Promise, FOLDERNAMES){

    var USER_FOLDERNAME    = FOLDERNAMES.USER,
        DATA_FOLDERNAME    = FOLDERNAMES.DATA,
        PROJECT_FOLDERNAME = FOLDERNAMES.PROJECT;

    function formatpath(path){
        path = path.replace(/\\/g, '/');
        if(path.indexOf('/') === 0){
            path = path.substring(1, path.length);
        }
        return path;
    }

    var inner = {
        mk: function(path){
            path = formatpath(path);

            var queue = path.split('/'), 
                filename = queue.pop(),
                created = false;

            path = USER_FOLDERNAME;
            return new Promise(function(resolve, reject){
                function foo(){
                    if(queue.length === 0){
                        if(filename){
                            path += filename;
                            fs.exists(path, function(exists){
                                if(!exists){
                                    created = true;
                                }

                                fs.appendFile(path, '', function(err){
                                    if(!err){
                                        resolve(created);
                                    }else {
                                        reject(err);
                                    }
                                });
                            });
                        }else {
                            path = path.substring(0, path.length - 1);
                            fs.appendFile(path, '', function(err){
                                if(err){
                                    resolve(created);
                                }else {
                                    reject(err);
                                }
                            });
                        }
                        return;
                    }

                    path += queue.shift() + '/';
                    fs.mkdir(path, function(err){
                        if(!err){
                            created = true;
                            foo();
                        }else if(err.code === 'EEXIST'){
                            foo();
                        }else {
                            reject(err);
                        }
                    });
                }

                foo();
            });
        },

        tc: function(filename){
            var _self = this;

            var source = PROJECT_FOLDERNAME + formatpath(filename),
                target = DATA_FOLDERNAME + formatpath(filename);

            return new Promise(function(resolve, reject){
                function copy(){
                    fs.readFile(source, function(err, buf){
                        if(!err){
                            fs.writeFile(USER_FOLDERNAME + target, buf, function(err){
                                if(!err){
                                    resolve(USER_FOLDERNAME + target);
                                }else {
                                    reject(err);
                                }
                            });
                        }else {
                            reject(err);
                        }
                    });
                }

                _self.mk(target).then(function(created){
                    if(created){
                        copy();
                    }else {
                        fs.readFile(USER_FOLDERNAME + target, function(err, buf){
                            if(!buf.toString().replace(/(^\s+|\s+$)/g, '')){
                                copy();
                            }else {
                                resolve(USER_FOLDERNAME + target);
                            }
                        });
                    }
                });
            });
        }
    };

    return {
        readJSONFile: function(filename){

            return new Promise(function(resolve, reject){

                inner.tc(filename).done(function(fn){

                    fs.readFile(fn, function(err, buf){
                        
                        if(!err){
                            resolve(JSON.parse(buf.toString()));
                        }else{
                            reject(err);
                        }
                    });

                }, reject);
            });
        },
        
        
        writeJSONFile: function(filename, object){
            
            return new Promise(function(resolve, reject){
                
                inner.tc(filename).done(function(fn){

                    fs.writeFile(fn, JSON.stringify(object), function(err){
                        
                        if(!err){
                            resolve();
                        }else {
                            reject(err);
                        }
                    });

                }, reject);
            });
        }
    };
}(require('fs'), require('promise'), require('./consts/foldernames')));
