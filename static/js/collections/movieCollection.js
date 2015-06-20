define([
    'jquery',
    'underscore',
    'backbone',
    'models/movie'
], function(
    $,
    _,
    Backbone,
    Movie
) {
    var MovieCollection = Backbone.Collection.extend({
        model: Movie,

        url: 'api/v1.0/movies',

        searchCache: [],

        get: function(ids) {
            var self = this;

            if (ids.constructor === Array) {
                return _.map(ids, function(id) {
                    return Backbone.Collection.prototype.get.call(self, id);
                });
            } else {
                return Backbone.Collection.prototype.get.call(this, ids);
            }
        },

        search: function(query) {
            var self = this,
                deferred = $.Deferred();

            if (this.searchCache && this.searchCache[query]) {
                deferred.resolveWith(this, [this.get(this.searchCache[query])]);
            } else {
                this.fetch({
                    data: {query: query},
                    remove: false
                }).done(function(data) {
                    self.searchCache[query] = _.pluck(data, 'id');
                    deferred.resolveWith(self, [self.get(self.searchCache[query])]);
                });
            }

            return deferred.promise();
        }
    });

    return MovieCollection;
});