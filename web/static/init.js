seajs.config({
    paths: {
        'local': '/web/static/'
    },
    
    alias: {
        'overlay'  : 'local/overlay.js',
        'page'     : 'local/page.js',
        'rule-item': 'local/rule-item.js'
    }
});

seajs.use(['rule-item']);
//seajs.use(['rule-item'], function(ruleItem){
//    ruleItem.add({
//        name: 'a',
//        from: 'b',
//        to  : 'c'
//    });
//});