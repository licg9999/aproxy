module.exports = (function(fs, Promise){
    return {
        readJSONFile: function(filename){
            
            return new Promise(function(resolve, reject){
                
                fs.readFile(filename, function(err, buf){
                    
                    if(err){
                        reject(err);
                    }else{
                        resolve(JSON.parse(buf.toString()));
                    }
                });
            });
        },
        
        
        writeJSONFile: function(filename, object){
            
            return new Promise(function(resolve, reject){
                
                fs.writeFile(filename, JSON.stringify(object), function(err){
                    
                    if(err){
                        reject(err);
                    }else {
                        resolve();
                    }
                });
            });
        }
    };
}(require('fs'), require('promise')));