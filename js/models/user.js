define(['jquery', 'underscore', 'backbone', 'config'], function($, _, Backbone, Config) {
    'use strict';

    return Backbone.Model.extend({
        url: [Config.apiUrl, 'me'].join('/'),

        initialize: function() {
            this.isAuthenticated = false;
            this.isEmployee = true;

            this.listenTo(this, 'sync', function() {
                this.isAuthenticated = true;
            });
        },

        data: function() {
            var flags = {
                isAuthenticated: this.isAuthenticated,
                isEmployee: this.isEmployee
            };

            return $.extend({}, this.attributes, flags);
        }
    });
});