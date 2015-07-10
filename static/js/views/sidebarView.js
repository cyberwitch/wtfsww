define([
    'jquery',
    'underscore',
    'foundation',
    'foundationOffCanvas',
    'handlebars',
    'models/sidebar',
    'views/baseView',
    'views/search/searchbarView',
    'text!templates/sidebar.html'
], function(
    $,
    _,
    Foundation,
    FoundationOffCanvas,
    Handlebars,
    Sidebar,
    BaseView,
    SearchbarView,
    sidebarTemplate
) {
    var SidebarView = BaseView.extend({
        template: Handlebars.compile(sidebarTemplate),

        model: new Sidebar(),

        events: {
            'click a': 'onItemClick'
        },

        initialize: function() {
            BaseView.prototype.initialize.call(this);

            this.searchbarView = new SearchbarView({sidebarView: this});
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$('.searchbar').html(this.searchbarView.render().el);

            return this;
        },

        collapse: function() {
            Foundation.utils.is_small_only() && $('.off-canvas-wrap').foundation('offcanvas', 'hide', 'move-right');
        },

        onItemClick: function(e) {
            e.preventDefault();
            this.collapse();
            Backbone.history.navigate($(e.currentTarget).data('route'), {trigger: true});
        }
    });

    return SidebarView;
});