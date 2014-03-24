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
    return Backbone.View.extend({
        tagName: 'div',
        className: 'HH-ResumeBuilder-SideBar side-bar',

        template: _.template(SideBarTemplate),

        initialize: function(options) {
            this.model = options.model;
            this.listenToOnce(this.model, 'load', this.render);
            this.positionFromTop = 60;

             _.bindAll(this, 'switchFloat');
            $(window).scroll(this.switchFloat);
        },

        render: function() {
            this.$el.html(this.template({
               
            }));
            $('.HH-ResumeBuilder-SideBar').append(this.el);

            this.positionFromTop = this.$el.find('.resume__status').position().top -10;
        },

        switchFloat: function() {
            if ($(document).scrollTop() < this.positionFromTop) { 
                this.$el.find('.resume__status').removeClass('block_fixed');
            } else {
                this.$el.find('.resume__status').addClass('block_fixed');
            }
        }
    });
});
