define([
    'jquery',
    'underscore',
    'backbone',
    'views/search/searchbarView',
    'text!templates/index/index.html'
], function(
    $,
    _,
    Backbone,
    SearchbarView,
    indexTemplate
) {
    var IndexView = Backbone.View.extend({
        initialize: function() {
            this.searchbarView = new SearchbarView();
        },

        render: function() {
            this.$el.html(_.template(indexTemplate));
            this.$('div.searchbar').html(this.searchbarView.render().el);

            return this;
        }
    });

    return IndexView;
});