define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        template: _.template($('#HH-ResumeBuilder-SpecializationTemplate').html()),

        initialize: function(options) {
            this.specializationIds = options.specializationIds;
        },

        render: function() {
            var data,
                specializationsCopy;

            specializationsCopy = _.clone(this.model.get('specializations'));
            data = {
                leftSpecializations: specializationsCopy.splice(0, Math.ceil(specializationsCopy.length / 2)),
                rightSpecializations: specializationsCopy,
                specializationIds: this.specializationIds
            };

            this.$el.html(this.template(data));

            return this;
        }
    });
});