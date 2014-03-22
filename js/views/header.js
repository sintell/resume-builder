define([
    'underscore',
    'backbone',
    'config/config.js',
    'text!templates/header.html'
], function(
    _,
    Backbone,
    Config,
    HeaderTemplate
) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        el: '.HH-ResumeBuilder-Header',

        template: _.template(HeaderTemplate),

        initialize: function(attributes, options) {

        },

        render: function() {
            var data;

            data = {
                authenticated: this.model.authenticated,
                user: this.model.attributes,
                serverHost: Config.serverHost,
                oauthServerPort: Config.oauthServerPort
            };

            this.$el.html(this.template(data));
        }
    });
});
