define([
    'jquery',
    'backbone',
    'handlebars',
    'collections/movieCollection',
    'views/baseView',
    'text!templates/search/resultsList.html'
], function(
    $,
    Backbone,
    Handlebars,
    MovieCollection,
    BaseView,
    resultsListTemplate
) {
    var MovieResultsView = BaseView.extend({
        template: Handlebars.compile(resultsListTemplate),

        collection: MovieCollection.getInstance(),

        events: {
            'click a': 'navigateToMovie'
        },

        initialize: function(options) {
            BaseView.prototype.initialize.call(this);

            options = options || {};

            this.query = options.query;
        },

        preload: function() {
            var self = this;

            return [this.collection.fetch({query: this.query}).done(function(movies) {
                self.movies = movies;
            })];
        },

        render: function() {
            if (this.finishedLoading) {
                this.$el.html(this.template({movies: this.movies}));
            } else {
                this.$el.html(this.loadingTemplate());
            }

            return this;
        },

        navigateToMovie: function(e) {
            e.preventDefault();
            Backbone.history.navigate('movies/' + $(e.currentTarget).data('movie-id'), {trigger: true});
        }
    });

    return MovieResultsView;
});