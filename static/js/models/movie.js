define([
    'backbone'
], function(
    Backbone
) {
    var Movie = Backbone.Model.extend({
        defaults: {
            name: null,
            overview: null,
            episodes: null,
            image_url: null,
            year: null,
            seasons: null
        }
    });

    return Movie;
});