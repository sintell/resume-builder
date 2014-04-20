define([
    'underscore',
    'backbone',
    'utils',
    'text!templates/infoSection.html'
], function(
    _,
    Backbone,
    Utils,
    InfoSectionTemplate
) {
    'use strict';

    return Backbone.View.extend({
        className: 'HH-Resume-ResumeSection',

        namespace: 'info',

        template: _.template(InfoSectionTemplate),

        render: function() {
            var data = $.extend({}, this.model.data(), {
                updated_at: Utils.formatUpdateTime(this.model.get('updated_at'))
            });

            this.$el.html(this.template(data));

            return this;
        }
    });
});
