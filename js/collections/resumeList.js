define(['underscore', 'backbone', 'models/resume', 'config/config'], function(_, Backbone, Resume, Config) {
    'use strict';

    return Backbone.Collection.extend({
        model: Resume,

        url: [Config.apiUrl, 'resumes/mine'].join('/'),

        parse: function(response) {
            return response.items;
        }
    });
});