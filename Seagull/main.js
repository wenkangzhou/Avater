(function() {
    window.getViewTemplatePath = function(path) {
        return 'text!templates/' + path + '.html';
    }
    require(['AbstractApp'], function(App) {
        //实例化App
        var app = new App({
            hasPushState: false,
            'defaultView': 'index',
            'viewRootPath': 'views/'
        });
    });
})();