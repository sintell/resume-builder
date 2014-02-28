define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    return Backbone.Model.extend({
        defaults: {
            'salary': {}
        },

        url: function() {
            return this.get('url');
        }
    });
});