define(['underscore', 'backbone', 'models/industry', 'config'], function(_, Backbone, Industry, Config) {
    'use strict';

    return Backbone.Collection.extend({
        model: Industry,

        url: [Config.apiUrl, 'industries'].join('/')
    });
});