define([
    'jquery',
    'underscore',
    'backbone'
], function(
    $,
    _,
    Backbone
) {
    var BaseModel = Backbone.Model.extend({
        lastFetched: null,

        fetch: function(options) {
            var now;

            if (this.expiration) {
                now = new Date();
                if (!this.lastFetched || this.lastFetched.getTime() + this.expiration < now.getTime()) {
                    this.lastFetched = now;
                    return Backbone.Model.prototype.fetch.call(this, options);
                } else {
                    return new $.Deferred().resolveWith(this, this.attributes).promise();
                }
            } else {
                return Backbone.Model.prototype.fetch.call(this, options);
            }
        }
    });

    return BaseModel;
});