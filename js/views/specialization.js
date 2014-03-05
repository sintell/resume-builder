define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        template: _.template($('#HH-ResumeBuilder-SpecializationTemplate').html()),

        initialize: function(options) {
            this.specializationIds = options.specializationIds;
        },

        render: function() {
            var data;

            data = {
                specialization: this.model.attributes,
                specializationIds: this.specializationIds
            };

            this.$el.html(this.template(data));

            return this;
        }
    });
});