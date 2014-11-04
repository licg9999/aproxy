(function(global){
    var config = {
        handlebars : './bower_components/handlebars/handlebars.min.js',
        jquery     : './bower_components/jquery/dist/jquery.min.js',
        seajs      : './bower_components/seajs/dist/sea.js',
        structurejs: './bower_components/uno-structurejs/build/structure-min.js'
    };
    
    global.importJS = function(url){
        if(config[url]){
            url = config[url];
        }
        global.document.write('<script src="' + url + '"></script>');
    };
}(window));