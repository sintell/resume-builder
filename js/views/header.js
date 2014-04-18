define([
    'underscore',
    'backbone',
    'config',
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

        render: function(options) {
            var data,
                defaults;

            defaults = {
                linkToList: false
            };

            data = $.extend({}, defaults, options, {
                user: this.model.data(),
                serverHost: Config.serverHost
            });

            this.$el.html(this.template(data));
        },

        _createResume: function() {
            this.trigger('createResume');
        }
    });
});
