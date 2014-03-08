define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        template: _.template($('#HH-ResumeBuilder-SpecializationTemplate').html()),

        events: {
            'change .HH-ResumeBuilder-Checkbox': '_validateCount'
        },

        initialize: function(options) {
            this.specializationIds = options.specializationIds;
            this.maxCount = options.maxCount;
        },

        render: function() {
            var data;

            data = {
                specialization: this.model.attributes,
                specializationIds: this.specializationIds
            };

            this.$el.html(this.template(data));

            this._validateCount();

            return this;
        },

        _validateCount: function() {
            if (this.$el.find('.HH-ResumeBuilder-Checkbox:checked').length >= this.maxCount) {
                this.$el.find('.HH-ResumeBuilder-Checkbox:not(:checked)').attr('disabled', true);
            } else {
                this.$el.find('.HH-ResumeBuilder-Checkbox').removeAttr('disabled');
            }
        }
    });
});