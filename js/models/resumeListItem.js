define(['underscore', 'backbone', 'models/resume','config'], function(_, Backbone, Resume, Config) {
    'use strict';

    return Backbone.Model.extend({

        initialize: function() {

        },

        url: [Config.apiUrl, 'resumes/mine'].join('/'),
    });
});