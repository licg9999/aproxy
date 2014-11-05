seajs.config({
    paths: {
        'local': '/static'
    },
    
    alias: {
        'overlay'    : 'local/overlay.js',
        'page'       : 'local/page.js',
        'rule-item'  : 'local/rule-item.js',
        'remote-item': 'local/remote-item.js'
    }
});

seajs.use(['rule-item', 'remote-item']);