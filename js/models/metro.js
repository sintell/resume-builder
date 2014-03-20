define(['underscore', 'backbone', 'config'], function(_, Backbone, Config) {
    'use strict';

    return Backbone.Model.extend({
        setCity: function(id) {
            this.id = id;
        },

        url: function() {
            return [Config.apiUrl, 'metro', this.id].join('/')
        },

        parse: function(responce) {
            if (responce.description) {
                return null;
            }

            return responce;
        }
    });
});