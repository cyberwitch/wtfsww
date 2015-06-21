define([
    'models/baseModel'
], function(
    BaseModel
) {
    var Movie = BaseModel.extend({
        defaults: {
            title: null,
            image_url: null,
            year: null
        },

        expiration: 60 * 60 * 1000
    });

    return Movie;
});