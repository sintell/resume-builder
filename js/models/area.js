define(['underscore', 'backbone', 'config'], function(_, Backbone, Config) {
    'use strict';

    return Backbone.Model.extend({
        url: [Config.apiUrl, 'areas'].join('/')
    });
});