module.exports = (function(ds, instance){

    return {
        readJSONFile: function(filename){
            return ds.readJSONFile(filename);
        },
        
        writeJSONFile: function(filename, object){
            return ds.writeJSONFile(filename, object).then(function(){
                instance.update();
            });
        }
    };
}(require('./ds'), require('./instance.js')));
