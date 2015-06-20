define([
    'backbone'
], function(
    Backbone
) {
    var Movie = Backbone.Model.extend({
        defaults: {
            title: null,
            image_url: null,
            year: null
        }
    });

    return Movie;
});