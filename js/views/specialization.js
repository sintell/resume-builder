define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        template: _.template($('#HH-ResumeBuilder-SpecializationTemplate').html()),

        initialize: function(options) {
            this.specializationIds = options.specializationIds;
        },

        render: function() {
            this.$el.html(this.template({
                specialization: this.model.attributes,
                specializationIds: this.specializationIds
            }));

            return this;
        }
    });
});