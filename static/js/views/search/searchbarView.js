define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'jqueryui',
    'views/baseView',
    'text!templates/search/searchbar.html',
    'text!templates/search/searchbarItem.html'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    JQueryUI,
    BaseView,
    searchbarTemplate,
    searchbarItemTemplate
) {
    var SearchbarView = BaseView.extend({
        template: Handlebars.compile(searchbarTemplate),

        itemTemplate: Handlebars.compile(searchbarItemTemplate),

        events: {
            'submit form': 'search',
            'click .search-button': 'search'
        },

        initialize: function(options) {
            options = options || {};

            this.query = options.query;
        },

        render: function() {
            var self = this;

            this.$el.html(this.template({query: this.query}));

            this.$('input').autocomplete({
                appendTo: this.$('input').parent(),
                source: function(request, response) {
                    self.collection.fetch({query: request.term}).done(function(movies) {
                        response(_.map(movies, function(movie) {
                            return _.extend(movie, {label: movie.title});
                        }));
                    });
                },
                select: function(event, ui) {
                    Backbone.history.navigate('movies/' + ui.item['id'], {trigger: true});
                }
            }).data("ui-autocomplete")._renderItem = function(ul, item) {
                return $(self.itemTemplate(item)).appendTo(ul);
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