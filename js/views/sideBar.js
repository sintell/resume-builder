define([
    'underscore',
    'backbone',
    'config/config.js',
    'text!templates/sideBar.html'
], function(
    _,
    Backbone,
    Config,
    SideBarTemplate
) {
    'use strict';

    var documentObject = $(document);
    var isiOs = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    var DEFAULT_TOP_MARGIN = 10;

    return Backbone.View.extend({
        tagName: 'div',
        className: 'HH-ResumeBuilder-SideBar side-bar',

        template: _.template(SideBarTemplate),

        initialize: function(options) {
            this.model = options.model;
            this.listenTo(this.model, 'load', this.render);

             _.bindAll(this, 'switchFloat', 'setProgressBar');
        },

        render: function() {
            this.$el.html(this.template({
               
            }));

            $('.HH-ResumeBuilder-SideBar').append(this.el);

            this.$statusBlock = this.$el.find('.HH-SideBar-Block-Status');
            
            this.setProgressBar(this.model.get('_progress').percentage);
            // Вычитаем то расстояние, на которое сдвигается фиксированный блок от верхнего края,
            // по умолчанию - 10px
            this.positionFromTop = this.$statusBlock.position().top - DEFAULT_TOP_MARGIN;
            $(window).scroll(this.switchFloat);
        },

        switchFloat: function() {
            if (!isiOs && documentObject.scrollTop() < this.positionFromTop) { 
                this.$statusBlock.removeClass('block_fixed');
            } else {
                this.$statusBlock.addClass('block_fixed');
            }
        },

        setProgressBar: function(progressPercent) {
            this.$statusBlock.find('.HH-Block-Status-ProgressBar').width(progressPercent + '%');
            this.$statusBlock.find('.HH-Block-Status-ProgressText').text(progressPercent + '%');
        }
    });
});
