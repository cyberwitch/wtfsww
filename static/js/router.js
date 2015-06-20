define([
    'jquery',
    'underscore',
    'backbone',
    'collections/movieCollection',
    'views/indexView',
    'views/movieView',
    'views/search/movieResultsView'
], function(
    $,
    _,
    Backbone,
    MovieCollection,
    IndexView,
    MovieView,
    MovieResultsView
    ) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'search/:query': 'search',
            'movies/:id': 'movie',
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
        },

        movie: function(id) {
            var movieView = new MovieView({
                id: id,
                collection: this.movieCollection
            });

            $('#content').html(movieView.render().el);
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