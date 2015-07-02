require.config({
    paths: {
        jquery: 'libs/jquery/jquery',
        jqueryui: 'libs/jquery-ui/jquery-ui',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        handlebars: 'libs/handlebars/handlebars',
        text: 'libs/text/text',
        foundation: 'libs/foundation/foundation.min',
        foundationOffCanvas: 'libs/foundation/foundation/foundation.offcanvas'
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
        },
        foundation: {
            deps: ['jquery'],
            exports: 'Foundation'
        },
        foundationOffCanvas: {
            deps: ['foundation']
        }
    }
});

require(['app'], function(App) {
    App.initialize();
});