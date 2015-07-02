define([
    'underscore',
    'views/baseView',
    'text!templates/home.html'
], function(
    _,
    BaseView,
    homeTemplate
) {
    var HomeView = BaseView.extend({
        render: function() {
            this.$el.html(_.template(homeTemplate));

            return this;
        }
    });

    return HomeView;
});