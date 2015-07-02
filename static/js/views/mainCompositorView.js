define([
    'underscore',
    'views/baseView',
    'views/sidebarView',
    'text!templates/mainCompositor.html'
], function(
    _,
    BaseView,
    SidebarView,
    mainCompositorTemplate
) {
    var MainCompositorView = BaseView.extend({
        sidebarView: new SidebarView(),

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
            this.$('.left-off-canvas-menu').html(this.sidebarView.render().el);
            this.renderContentView();

            return this;
        },

        renderContentView: function() {
            this.contentView && this.$('#content').html(this.contentView.render().el);
        }
    });

    return MainCompositorView;
});