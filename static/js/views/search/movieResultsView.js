define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!templates/loading.html',
    'text!templates/search/resultsList.html'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    loadingTemplate,
    resultsListTemplate
) {
    var MovieResultsView = Backbone.View.extend({
        template: Handlebars.compile(resultsListTemplate),

        loadingTemplate: Handlebars.compile(loadingTemplate),

        initialize: function(options) {
            var self = this;

            options = options || {};

            this.collection.search(options.query).done(function(movies) {
                self.movies = _.map(movies, function(movie) {
                    return movie.toJSON();
                });
                self.render.call(self);
            });
        },

        render: function() {
            if (this.movies) {
                this.$el.html(this.template({movies: this.movies}));
            } else {
                this.$el.html(this.loadingTemplate());
            }

            return this;
        }
    });

    return MovieResultsView;
});