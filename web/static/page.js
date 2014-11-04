define(function(require, exports, module){
    module.exports = structure([
        function(ths, cfg){
            ths.alias('process');
            return function($elm){
                $elm.html(Handlebars.compile($elm.html())($.parseJSON($elm.attr('data-hbs-values'))));
            };
        }
    ], {
    });
});