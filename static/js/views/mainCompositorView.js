define([
    'jquery',
    'underscore',
    'backbone',
    'views/baseView',
    'views/search/searchbarView',
    'text!templates/mainCompositor.html'
], function(
    $,
    _,
    Backbone,
    BaseView,
    SearchbarView,
    mainCompositorTemplate
) {
    var MainCompositorView = BaseView.extend({
        initialize: function() {
            this.searchbarView = new SearchbarView({collection: this.collection});
        },

        setContentView: function(view, title) {
            this.contentView = view;
            title && this.setTitle(title);
            this.renderContentView();
        },

        setTitle: function(title) {
            this.title = title;
            this.$('.title').text(title);
        },

        render: function() {
            this.$el.html(_.template(mainCompositorTemplate, {title: this.title}));
            this.$('.searchbar').html(this.searchbarView.render().el);
            this.renderContentView();

            return this;
        },

        renderContentView: function() {
            this.contentView && this.$('#content').html(this.contentView.render().el);
        }
    });

    return MainCompositorView;
});