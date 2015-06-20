define([
    'jquery',
    'backbone',
    'handlebars',
    'models/movie',
    'text!templates/movie.html'
], function(
    $,
    Backbone,
    Handlebars,
    Movie,
    movieTemplate
) {
    var MovieView = Backbone.View.extend({
        template: Handlebars.compile(movieTemplate),

        initialize: function(options) {
            var self = this;

            options = options || {};

            this.model.fetch().done(function() {
                self.render.call(self);
            });
        },

        render: function() {
            this.$el.html(this.template({movie: this.model.toJSON()}));

            return this;
        }
    });

    return MovieView;
});