define(['underscore', 'backbone', 'models/resumeListItem', 'config'], function(_, Backbone, ResumeListItem, Config) {
    'use strict';

    return Backbone.Collection.extend({
        model: ResumeListItem,

        url: [Config.apiUrl, 'resumes/mine'].join('/'),

        parse: function(response) {
            console.log(response)
            return response.items;
        }
    });
});