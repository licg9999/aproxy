module.exports = (function(fs){
    var FILENAME = 'data/rules.json';
    
    return {
        read: function(){
            return fs.readJSONFile(FILENAME);
        },
        write: function(obj){
            return fs.writeJSONFile(FILENAME, obj);
        }
    };
}(require('../../fs.js')));
