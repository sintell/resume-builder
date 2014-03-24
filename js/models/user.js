define(['underscore', 'backbone', 'config'], function(_, Backbone, Config) {
    'use strict';

    return Backbone.Model.extend({
        url: [Config.apiUrl, 'me'].join('/'),

        initialize: function() {
            this.authenticated = false;
            this.listenTo(this, 'sync', function() {
                this.authenticated = true;
            });
        }
    });
});