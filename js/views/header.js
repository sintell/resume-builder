define([
    'jquery',
    'underscore',
    'backbone',
    'config/config.js',
    'text!templates/header.html'
], function(
    $,
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

        initialize: function(options) {
            this.model = options.model;
            this.listenToOnce(this.model, 'sync', this.render);
        },

        render: function() {
            this.$el.html(this.template({
                fio: [
                    this.model.get('last_name'),
                    this.model.get('first_name')
                ].join(' '),
                serverHost: APP_CONFIG.serverHost,
                oauthServerPort: APP_CONFIG.oauthServerPort
            }));
        }
    });
});
