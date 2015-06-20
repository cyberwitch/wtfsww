define([
    'jquery',
    'underscore',
    'backbone',
    'views/baseView',
    'views/search/searchbarView',
    'text!templates/index.html'
], function(
    $,
    _,
    Backbone,
    BaseView,
    SearchbarView,
    indexTemplate
) {
    var IndexView = BaseView.extend({
        initialize: function() {
            this.searchbarView = new SearchbarView({collection: this.collection});
        },

        render: function() {
            this.$el.html(_.template(indexTemplate));
            this.$('div.searchbar').html(this.searchbarView.render().el);

            return this;
        }
    });

    return IndexView;
});