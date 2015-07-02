define([
    'underscore',
    'backbone',
    'models/movie'
], function(
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

        getOrAdd: function(id) {
            var model = this.get(id);

            if (!model) {
                model = new Movie({id: id});
                this.add(model);
            }

            return model;
        },

        fetch: function(options) {
            var self = this;

            options = options || {};

            if (options.query) {
                if (this.searchCache && this.searchCache[options.query]) {
                    return $.Deferred()
                        .resolveWith(this, [_.pluck(this.get(this.searchCache[options.query]), 'attributes')]);
                } else {
                    return this.fetch({
                        data: {query: options.query},
                        remove: false
                    }).done(function(data) {
                        self.searchCache[options.query] = _.pluck(data, 'id');
                    });
                }

                return deferred.promise();
            } else {
                return Backbone.Collection.prototype.fetch.call(this, options);
            }
        }
    }, {
        instance: null,

        getInstance() {
            this.instance = this.instance || new MovieCollection();
            return this.instance;
        }
    });

    return MovieCollection;
});