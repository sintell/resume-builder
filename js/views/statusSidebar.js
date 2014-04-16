define([
    'underscore',
    'backbone',
    'config',
    'utils',
    'text!templates/statusSidebar.html'
], function(
    _,
    Backbone,
    Config,
    Utils,
    SideBarTemplate
) {
    'use strict';

    var documentObject = $(document);

    return Backbone.View.extend({
        template: _.template(SideBarTemplate),

        initialize: function(options) {
            this.model = options.model;
            this.listenTo(this.model, 'load', this.render);

            _.bindAll(this, 'switchFloat', 'setProgressBar');
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));

            this.$statusBlock = $('.HH-Sidebar-Status');

            this.$statusBlock.html(this.el);

            this.$infoSidebar = $('.HH-Sidebar-Info');
            
            this.setProgressBar(this.model.get('_progress').percentage);

            this.positionFromTop = this.$statusBlock.position().top;

            if (!Utils.isIOS()) {
                $(window).scroll(this.switchFloat);
            }
        },

        switchFloat: function() {
            if (!Utils.isIOS() && documentObject.scrollTop() < this.positionFromTop) {
                this.$statusBlock.removeClass('sidebar-section_fixed');

                this.$infoSidebar.css({
                    'paddingTop': 0
                });

            } else {
                this.$statusBlock.addClass('sidebar-section_fixed');
                var offset = this.$statusBlock.height();
                this.$infoSidebar.css({
                    'paddingTop': offset
                });
            }
        },

        setProgressBar: function(progressPercent) {
            this.$statusBlock.find('.HH-Sidebar-ProgressBar').width(progressPercent + '%');
            this.$statusBlock.find('.HH-Sidebar-ProgressText').text(progressPercent + '%');
        }
    });
});
