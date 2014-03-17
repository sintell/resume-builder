define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    return Backbone.Model.extend({
        initialize: function(attributes, options) {
            this.resume = options.resume;
        },

        url: function() {
            if (this.resume && !this.resume.isNew()) {
                return ['https://api.hh.ru/resumes', this.resume.id, 'conditions'].join('/');
            } else {
                return 'https://api.hh.ru/resume_conditions';
            }
        }
    });
});