define(['jquery', 'underscore', 'backbone', 'views/suggest'], function($, _, Backbone, Suggest, AreaModal) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'span',

        className: 'HH-ResumeSection-Component-Relocation',

        componentName: 'relocation',

        template: _.template($('#HH-ResumeBuilder-Component-Relocation').html()),

        events: {
            'click input[type="radio"]': '_onRadioClick'
        },

        initialize: function(options) {
            this.relocation_type = options.dictionary.attributes.relocation_type;
        },

        fill: function(attributes) {
            this.relocation = attributes.relocation;
        },

        render: function() {
            var data;

            data = {
                relocation_type: this.relocation_type,
                relocation: this.relocation
            };

            this.$el.html(this.template(data));

            return this;
        },

        takeback: function(attributes) {
            attributes.relocation = attributes.relocation || {};

            attributes.relocation.type = {
                id: this.relocation.type.id
            };
        },

        _onRadioClick: function(event) {
            event.stopPropagation();

            this.relocation.type.id = $(event.currentTarget).val();

            this.trigger('selectRelocation', this.relocation.type.id);
        }
    });
});
