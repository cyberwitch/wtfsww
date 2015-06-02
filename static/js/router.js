define([
    'jquery',
    'underscore',
    'backbone',
    'collections/movieCollection',
    'views/index/indexView',
    'views/search/resultsListView'
], function(
    $,
    _,
    Backbone,
    MovieCollection,
    IndexView,
    ResultsListView
    ) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'search/:query': 'search',
            '*actions': 'index'
        },

        index: function() {
            var indexView = new IndexView();
            $('#content').html(indexView.render().el);
        },

        search: function(query) {
            var results = new MovieCollection([], {query: query}),
                resultsListView = new ResultsListView({collection: results});

            $('#content').html(resultsListView.render().el);
        }
    });

    var initialize = function() {
        var app_router = new AppRouter;
        Backbone.history.start();
    };
    return {
        initialize: initialize
    }
});