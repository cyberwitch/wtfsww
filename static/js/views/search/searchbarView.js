define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'jqueryui',
    'collections/movieCollection',
    'text!templates/search/searchbar.html'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    JQueryUI,
    MovieCollection,
    searchbarTemplate
) {
    var SearchbarView = Backbone.View.extend({
        template: Handlebars.compile(searchbarTemplate),

        collection: new MovieCollection(),

        events: {
            'submit form': 'search'
        },

        initialize: function(options) {
            options = options || {};
            this.query = options.query;
        },

        render: function() {
            var collection = this.collection;

            this.$el.html(this.template({query: this.query}));

            this.$('input').autocomplete({
                appendTo: this.$('input').parent(),
                source: function(request, response) {
                    collection.query = request.term;
                    collection.fetch().done(function(data) {
                        response(_.map(data, function(d) {
                            return {
                                value: d.id,
                                label: d.name,
                                image_url: d.image_url
                            };
                        }));
                    });
                },
                select: function(event, ui) {
                    Backbone.history.navigate('show/' + ui.item['value'], {trigger: true});
                }
            }).data( "ui-autocomplete")._renderItem = function( ul, item) {
                var innerHtml = item['image_url'] ? '<img src="' + item['image_url'] + '">' : '';
                innerHtml += item['label'];

                return $('<li></li>')
                    .data('item.autocomplete', item)
                    .append(innerHtml)
                    .appendTo(ul);
            };

            return this;
        },

        search: function() {
            Backbone.history.navigate('search/' + this.$('input').val(), {trigger: true});
            return false;
        }
    });

    return SearchbarView;
});