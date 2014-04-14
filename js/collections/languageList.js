define([
    'backbone',
    'config'
], function(
    Backbone,
    Config
) {
    'use strict';

    return Backbone.Collection.extend({
        model: Backbone.Model,

        url: [Config.apiUrl, 'languages'].join('/')
    });
});
