define([
    'jquery',
    'underscore',
    'backbone',
    'foundation',
    'views/homeView',
    'views/mainCompositorView',
    'views/movieView',
    'views/search/movieResultsView'
], function(
    $,
    _,
    Backbone,
    Foundation,
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
            this.homeView = new HomeView();

            this.mainCompositorView = new MainCompositorView();

            $('body').html(this.mainCompositorView.render().el);
            $(document).foundation();
        },

        home: function() {
            this.mainCompositorView.setContentView(this.homeView, 'Home');
        },

        search: function(query) {
            var movieResultsView = new MovieResultsView({query: query});

            this.mainCompositorView.setContentView(movieResultsView, 'Search Results');
        },

        movie: function(id) {
            var movieView = new MovieView({id: id});

            this.mainCompositorView.setContentView(movieView, 'Movie');
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