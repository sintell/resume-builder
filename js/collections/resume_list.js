define(['underscore', 'backbone', 'models/resume'], function(_, Backbone, Resume) {
    'use strict';

    return Backbone.Collection.extend({
        model: Resume 
    });
});