define([
    'underscore',
    'backbone',
    'config/config.js',
    'utils',
    'text!templates/sideBar.html'
], function(
    _,
    Backbone,
    Config,
    Utils,
    SideBarTemplate
) {
    'use strict';

    var documentObject = $(document);
    var DEFAULT_TOP_MARGIN = 10;

    return Backbone.View.extend({
        template: _.template(StatusSidebarTemplate),

        initialize: function(options) {
            this.model = options.model;
            this.listenTo(this.model, 'load', this.render);

             _.bindAll(this, 'switchFloat', 'setProgressBar');
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));

            this.$statusBlock = $('.HH-Sidebar-Status');

            this.$statusBlock.html(this.el);
            
            this.setProgressBar(this.model.get('_progress').percentage);

            // Вычитаем то расстояние, на которое сдвигается фиксированный блок от верхнего края,
            // по умолчанию - 10px
            this.positionFromTop = this.$statusBlock.position().top - DEFAULT_TOP_MARGIN;
            $(window).scroll(this.switchFloat);
        },

        switchFloat: function() {
            if (!Utils.isIOS() && documentObject.scrollTop() < this.positionFromTop) {
                this.$statusBlock.removeClass('block_fixed');
            } else {
                this.$statusBlock.addClass('sidebar-section_fixed');
            }
        },

        setProgressBar: function(progressPercent) {
            this.$statusBlock.find('.HH-Sidebar-ProgressBar').width(progressPercent + '%');
            this.$statusBlock.find('.HH-Sidebar-ProgressText').text(progressPercent + '%');
        }
    });
});
