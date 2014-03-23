define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/resumeListItem.html',
], function(
    $,
    _,
    Backbone,
    ResumeListItemTemplate
) {
    'use strict';

    var formatUpdateTime = function(updateTime) {
        var date = new Date(updateTime);
        var SECOND = 1000,
            MINUTE = SECOND * 60,
            HOUR = MINUTE * 60;
        var dateString = "";

        if ( new Date() - date > 24 * HOUR) {
            dateString = [Math.round((new Date() - date)/HOUR), 'часов назад'].join(' ');
        }  else {
            dateString = [
                [date.getDate(), date.getMonth()+1, date.getFullYear()].join('.'),
                [date.getHours(), date.getMinutes()].join(':')
            ].join(' ');
        }

        return dateString;
    };

    return Backbone.View.extend({
        tagName: 'li',
        className: 'HH-Resume-ResumeListItem',

        template: _.template(ResumeListItemTemplate),

        initialize: function() {
            this.render();
        },
        render: function() {
            var data = {
                title: this.model.get('title'),
                status: this.model.get('status').name,
                access: this.model.get('access').type.name,
                updatedAt: formatUpdateTime(this.model.get('updated')),
                totalViews: this.model.get('total_views'),
                newViews: this.model.get('new_views')
            };
            this.$el.html(this.template(data));
            return this;
        }
    });
    

});
