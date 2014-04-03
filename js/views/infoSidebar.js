define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/infoSidebar.html'
], function(
    $,
    _,
    Backbone,
    InfoSidebarTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(InfoSidebarTemplate),

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
            this.$el.html(this.template(this.model.attributes));
            console.log('render', arguments);

            $('.HH-Sidebar-Info').html(this.$el);

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
