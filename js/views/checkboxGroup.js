define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        initialize: function(options) {
            this.maxCount = options.maxCount;
        },

        validateCount: function($el) {
            var checkboxes = $el.find('.HH-ResumeBuilder-Checkbox');

            if (checkboxes.filter(':checked').length >= this.maxCount) {
                checkboxes.filter(':not(:checked)').prop('disabled', true);
            } else {
                checkboxes.prop('disabled', false);
            }
        }
    });
});