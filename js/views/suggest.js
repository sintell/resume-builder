define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        template: _.template($('#HH-ResumeBuilder-Component-Suggest').html()),

        events: {
            'click li': '_select'
        },

        initialize: function(data, options) {
            this.data = data;
            this.options = options;

            this.suggest = [];
        },

        render: function() {
            var data = $.extend({}, {
                suggest: this.suggest
            });

            this.$el.html(this.template(data));
            this.$el.find('.HH-Suggest-Results').css('width', this.width + 'px');

            return this;
        },

        hide: function() {
            this.$el.empty();
        },

        updateSuggest: function(text, width) {
            this.width = width;

            if (text.length >= this.options.minInput) {
                this.suggest = this._getSuggest(text);
            } else {
                this.suggest = [];
            }

            this.render();
        },

        _getSuggest: function(text) {
            var result = [];

            for (var i in this.data){
                if (this.data[i].toLowerCase().indexOf(text.toLowerCase()) === 0) {
                    result.push(this.data[i]);
                }
            }

            if (
                result.length === 1 &&
                result[0].toLocaleLowerCase() === text.toLocaleLowerCase()
                )
            {
                return [];
            }

            return result;
        },

        _select: function(event) {
            this.trigger('selectSuggest', {
                text: $(event.currentTarget).text()
            });
        }
    });
});