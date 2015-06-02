require.config({
    paths: {
        jquery: 'libs/jquery/jquery',
        jqueryui: 'libs/jquery-ui/jquery-ui',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        handlebars: 'libs/handlebars/handlebars',
        text: 'libs/text/text'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        jqueryui: {
            deps: ['jquery']
        }
    }
});

require(['app'], function(App) {
    App.initialize();
});