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

        events: {
            'click .HH-ResumeBuilder-ButtonCreate': '_createResume'
        },

        initialize: function(options) {
            this.parent = options.parent;
        },

        render: function() {
            var data;

            data = {
                user: this.model.data(),
                serverHost: Config.serverHost,
                serverPort: Config.staticServerPort,
                oauthServerPort: Config.oauthServerPort
            };

            this.$el.html(this.template(data));
        },

        _createResume: function() {
            this.parent.createResume();
        }
    });
});
