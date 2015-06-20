define([
    'jquery',
    'underscore',
    'backbone',
    'collections/movieCollection',
    'views/indexView',
    'views/search/movieResultsView'
], function(
    $,
    _,
    Backbone,
    MovieCollection,
    IndexView,
    MovieResultsView
    ) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'search/:query': 'search',
            '*actions': 'index'
        },

        movieCollection: new MovieCollection(),

        index: function() {
            var indexView = new IndexView({collection: this.movieCollection});
            $('#content').html(indexView.render().el);
        },

        search: function(query) {
            var movieResultsView = new MovieResultsView({
                collection: this.movieCollection,
                query: query
            });

            $('#content').html(movieResultsView.render().el);
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