define([
    'jquery',
    'underscore',
    'backbone',
    'foundation',
    'collections/movieCollection',
    'views/homeView',
    'views/mainCompositorView',
    'views/movieView',
    'views/search/movieResultsView'
], function(
    $,
    _,
    Backbone,
    Foundation,
    MovieCollection,
    HomeView,
    MainCompositorView,
    MovieView,
    MovieResultsView
    ) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'home': 'home',
            'search/:query': 'search',
            'movies/:id': 'movie',
            '*actions': 'home'
        },

        initialize: function() {
            this.movieCollection = new MovieCollection();

            this.homeView = new HomeView();

            this.mainCompositorView = new MainCompositorView({collection: this.movieCollection});

            $('body').html(this.mainCompositorView.render().el);
            $(document).foundation();
        },

        home: function() {
            this.mainCompositorView.setContentView(this.homeView, 'Home');
        },

        search: function(query) {
            var movieResultsView = new MovieResultsView({
                collection: this.movieCollection,
                query: query
            });

            this.mainCompositorView.setContentView(movieResultsView, 'Search Results');
        },

        movie: function(id) {
            var movieView = new MovieView({
                id: id,
                collection: this.movieCollection
            });

            this.mainCompositorView.setContentView(movieView, '');
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