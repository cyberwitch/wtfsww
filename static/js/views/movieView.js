define([
    'jquery',
    'backbone',
    'handlebars',
    'collections/movieCollection',
    'models/movie',
    'views/baseView',
    'text!templates/movie.html'
], function(
    $,
    Backbone,
    Handlebars,
    MovieCollection,
    Movie,
    BaseView,
    movieTemplate
) {
    var MovieView = BaseView.extend({
        template: Handlebars.compile(movieTemplate),

        collection: MovieCollection.getInstance(),

        initialize: function(options) {
            BaseView.prototype.initialize.call(this);

            options = options || {};

            this.model = this.collection.getOrAdd(options.id);
        },

        preload: function() {
            return [this.model.fetch()];
        },

        render: function() {
            if (this.finishedLoading) {
                this.$el.html(this.template({movie: this.model.toJSON()}));
            } else {
                this.$el.html(this.loadingTemplate());
            }

            return this;
        }
    });

    return MovieView;
});