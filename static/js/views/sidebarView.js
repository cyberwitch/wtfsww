define([
    'jquery',
    'underscore',
    'foundation',
    'foundationOffCanvas',
    'views/baseView',
    'views/search/searchbarView',
    'text!templates/sidebar.html'
], function(
    $,
    _,
    Foundation,
    FoundationOffCanvas,
    BaseView,
    SearchbarView,
    sidebarTemplate
) {
    var SidebarView = BaseView.extend({
        searchbarView: new SearchbarView(),

        events: {
            'click a': 'onItemClick'
        },

        render: function() {
            this.$el.html(_.template(sidebarTemplate));
            this.$('.searchbar').html(this.searchbarView.render().el);

            return this;
        },

        collapse: function() {
            Foundation.utils.is_small_only() && $('.off-canvas-wrap').foundation('offcanvas', 'hide', 'move-right');
        },

        onItemClick: function(e) {
            this.collapse();
        }
    });

    return SidebarView;
});