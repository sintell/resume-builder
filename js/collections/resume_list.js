define(['underscore', 'backbone', 'models/resume'], function(_, Backbone, Resume) {
    'use strict';

    return Backbone.Collection.extend({
        model: Resume,

        url: 'https://api.hh.ru/resumes/mine',

        parse: function(response, options) {
            return response.items;
        }
    });
});