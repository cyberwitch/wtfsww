define([
    'jquery',
    'backbone',
    'handlebars',
    'text!templates/search/resultsList.html'
], function(
    $,
    Backbone,
    Handlebars,
    resultsListTemplate
) {
    var ResultsListView = Backbone.View.extend({
        template: Handlebars.compile(resultsListTemplate),

        initialize: function(options) {
            options = options || {};
            this.collection = options.collection;
        },

        render: function() {
            var self = this;

            this.collection.fetch().done(function(data) {
                self.$el.html(self.template({shows: data}));
            });

            return this;
        }
    });

    return ResultsListView;
});