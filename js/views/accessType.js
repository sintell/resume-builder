define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/accessType.html'
], function(
    $,
    _,
    Backbone,
    AreaTemplate
) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-AccessType',

        componentName: 'access-type',

        events: {
            'change .HH-AccessType-Radio': '_select'
        },

        template: _.template(AreaTemplate),

        initialize: function(options) {
            this.accessTypes = options.dictionary.attributes.resume_access_type;
        },

        fill: function(attributes) {
            this.access = attributes.access;
        },

        render: function() {
            var data;

            data = {
                access: this.access,
                accessTypes: this.accessTypes
            };

            this.$el.html(this.template(data));

            return this;
        },

        takeback: function(attributes) {
            attributes.access = {
                type: {}
            };

            attributes.access.type.id = this.selectedId;
        },

        _select: function(event) {
            event.preventDefault();

            this.selectedId = $(event.currentTarget).val();
        }
    });
});