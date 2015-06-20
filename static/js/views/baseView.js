define([
    'underscore',
    'backbone',
    'handlebars',
    'text!templates/loading.html'
], function(
    _,
    Backbone,
    Handlebars,
    loadingTemplate
) {
    var BaseView = Backbone.View.extend({
        loadingTemplate: Handlebars.compile(loadingTemplate),

        finishedLoading: false,

        initialize: function() {
            var self = this;

            setTimeout(function() {
                _.reduce(self.preload(), function(promise1, promise2) {
                    return promise1.done(promise2.done);
                }).done(function() {
                    self.finishedLoading = true;
                    self.render.call(self);
                });
            }, 0);
        }
    });

    return BaseView;
});