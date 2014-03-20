define(['underscore', 'backbone', 'config/config'], function(_, Backbone, Config) {
    'use strict';

    return Backbone.Model.extend({
        initialize: function(attributes, options) {
            this.resume = options.resume;
        },

        url: function() {
            if (this.resume && !this.resume.isNew()) {
                return [Config.apiUrl, 'resumes', this.resume.id, 'conditions'].join('/');
            } else {
                return [Config.apiUrl,'resume_conditions'].join('/');
            }
        }
    });
});