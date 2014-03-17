define([
    'jquery',
    'underscore',
    'backbone',
    'views/checkboxGroup',
    'text!templates/specialization.html'
], function($, _, Backbone, CheckboxGroup, SpecializationTemplate) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(SpecializationTemplate),

        events: {
            'change .HH-ResumeBuilder-Checkbox': '_validateCount'
        },

        initialize: function(options) {
            this.specializationIds = options.specializationIds;
            this.checkboxGroup = new CheckboxGroup({
                maxCount: options.maxCount
            });
        },

        render: function() {
            var data;

            data = {
                specialization: this.model.attributes,
                specializationIds: this.specializationIds
            };

            this.$el.html(this.template(data));

            this.checkboxGroup.validateCount(this.$el);

            return this;
        },

        _validateCount: function() {
            this.checkboxGroup.validateCount(this.$el);
        }
    });
});