define([
    'underscore',
    'backbone',
    'handlebars',
    'jqueryui',
    'require',
    'collections/movieCollection',
    'views/baseView',
    'text!templates/search/searchbar.html',
    'text!templates/search/searchbarItem.html'
], function(
    _,
    Backbone,
    Handlebars,
    JQueryUI,
    Require,
    MovieCollection,
    BaseView,
    searchbarTemplate,
    searchbarItemTemplate
) {
    var SearchbarView = BaseView.extend({
        template: Handlebars.compile(searchbarTemplate),

        itemTemplate: Handlebars.compile(searchbarItemTemplate),

        collection: MovieCollection.getInstance(),

        events: {
            'submit form': 'search',
            'click .search-button': 'search'
        },

        initialize: function(options) {
            BaseView.prototype.initialize.call(this);

            options = options || {};

            this.query = options.query;

            this.sidebarView = options.sidebarView;
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
                    self.sidebarView.collapse();
                    Backbone.history.navigate('movies/' + ui.item['id'], {trigger: true});
                }
            }).data("ui-autocomplete")._renderItem = function(ul, item) {
                return $(self.itemTemplate(item)).appendTo(ul);
            };

            return this;
        },

        search: function(e) {
            e.preventDefault();
            this.sidebarView.collapse();
            Backbone.history.navigate('search/' + this.$('input').val(), {trigger: true});
        }
    });

    return SearchbarView;
});