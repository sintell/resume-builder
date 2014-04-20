define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'text!templates/tag.html'
], function($, _, Backbone, Utils, TagTemplate) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(TagTemplate),

        events: {
            'click .HH-Tag-Remove': '_remove'
        },

        addTag: function(text, data, notRender) {
            var contains = this.tags.some(function(tag) {
                return tag.text === text;
            });

            if (contains) {
                // нам не нужны дубликаты тэгов
                return false;
            }

            this.tags.push({
                text: text,
                data: data
            });

            if (!notRender) {
                this.render();
            }
        },

        removeTag: function(text) {
            this.tags = this.tags.filter(function(tag) {
                return tag.text !== text;
            });

            this.render();

            this.trigger('remove');
        },

        getCount: function(item) {
            return this.tags.length;
        },

        initialize: function(data, options) {
            this.data = data || [];
            this.options = options || {};

            this.tags = [];
        },

        takeback: function() {
            return this.tags;
        },

        render: function() {
            var data = {
                tags: this.tags
            };

            this.$el.html(this.template(data));
            return this;
        },

        _remove: function(event) {
            var text = $(event.currentTarget).siblings('.HH-Tag-Text').text();
            this.removeTag(text);
        }
    });
});