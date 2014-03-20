define(['underscore', 'backbone', 'config/config'], function(_, Backbone, Config) {
    'use strict';

    return Backbone.Model.extend({
        url: [Config.apiUrl, 'areas'].join('/')
    });
});