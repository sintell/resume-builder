define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/relocation.html'
], function($, _, Backbone, RelocationTemplate) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-Relocation',

        componentName: 'relocation',

        template: _.template(RelocationTemplate),

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
