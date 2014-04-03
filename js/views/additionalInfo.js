define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'text!templates/additionalInfo.html'
], function(
    $,
    _,
    Backbone,
    Utils,
    AdditionalInfoTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(AdditionalInfoTemplate),

        events: {
            'click .HH-ResumeInfo-ButtonUpdate': '_update',
            'click .HH-ResumeInfo-ButtonClone': '_clone',
            'click .HH-ResumeInfo-ButtonDestroy': '_destroy'
        },

        initialize: function(options) {
            this.listenTo(this.model, 'load', this.render);
            this.listenTo(this.model, 'sync', this.render);
        },

        render: function() {
            var data = $.extend({}, this.model.attributes, {
                updated_at: Utils.formatUpdateTime(this.model.get('updated_at'))
            });

            this.$el.html(this.template(data));
            console.log('render', arguments);

            $('.HH-ResumeBuilder-AdditionalInfo').html(this.$el);

            return this;
        },

        _update: function() {
            // TODO сначала реализовать публикацию резюме
        },

        _clone: function() {
            // TODO реализовать после мержа HH-55 и HH-53
        },

        _destroy: function() {
            var $section;

            $section = $('.HH-Resume-ResumeSectionAccess');
            $section.find('.HH-ResumeSection-SwitchEdit:visible').trigger('click');
            $(window).scrollTop($section.offset().top);
        }
    });
});
