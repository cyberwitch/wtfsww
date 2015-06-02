define([
    'backbone',
    'models/movie'
], function(
    Backbone,
    Movie
) {
    var MovieCollection = Backbone.Collection.extend({
        model: Movie,

        initialize: function(models, options) {
            options = options || {};
            this.query = options.query;
        },

        url: function() {
            return 'api/v1.0/search/' + this.query;
        }
    });

    return MovieCollection;
});