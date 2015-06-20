define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'views/baseView',
    'text!templates/search/resultsList.html'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    BaseView,
    resultsListTemplate
) {
    var MovieResultsView = BaseView.extend({
        template: Handlebars.compile(resultsListTemplate),

        events: {
            'click a': 'navigateToMovie'
        },

        initialize: function(options) {
            BaseView.prototype.initialize.call(this);

            this.query = options.query;
        },

        preload: function() {
            var self = this;

            return [this.collection.search(this.query).done(function(movies) {
                self.movies = _.map(movies, function(movie) {
                    return movie.toJSON();
                });
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