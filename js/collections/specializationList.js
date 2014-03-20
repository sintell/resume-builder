define(['underscore', 'backbone', 'models/specialization', 'config/config'], function(_, Backbone, Specialization, Config) {
    'use strict';

    return Backbone.Collection.extend({
        model: Specialization,

        url: [Config.apiUrl, '/specializations'].join('/')
    });
});