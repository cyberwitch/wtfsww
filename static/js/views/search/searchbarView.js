define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'jqueryui',
    'views/baseView',
    'text!templates/search/searchbar.html'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    JQueryUI,
    BaseView,
    searchbarTemplate
) {
    var SearchbarView = BaseView.extend({
        template: Handlebars.compile(searchbarTemplate),

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
                    collection.search(request.term).done(function(movies) {
                        response(_.map(movies, function(movie) {
                            return {
                                value: movie.get('id'),
                                label: movie.get('title'),
                                image_url: movie.get('image_url')
                            };
                        }));
                    });
                },
                select: function(event, ui) {
                    Backbone.history.navigate('movies/' + ui.item['value'], {trigger: true});
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

        search: function(e) {
            e.preventDefault();
            Backbone.history.navigate('search/' + this.$('input').val(), {trigger: true});
        }
    });

    return SearchbarView;
});