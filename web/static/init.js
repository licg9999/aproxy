seajs.config({
    paths: {
        'local': '/static'
    },
    
    alias: {
        'overlay'    : 'local/overlay.js',
        'template'   : 'local/template.js',
        'io'         : 'local/io.js',
        'rule-item'  : 'local/rule-item.js',
        'remote-item': 'local/remote-item.js'
    }
});

seajs.use(['rule-item', 'remote-item'], function(ruleItem, remoteItem){
    ruleItem.load();
    remoteItem.load();
});