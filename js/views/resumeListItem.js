define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'models/resume',
    'utils',
    'text!templates/resumeListItem.html'
], function(
    $,
    _,
    Backbone,
    Config,
    Resume,
    Utils,
    ResumeListItemTemplate
) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'li',

        className: 'HH-Resume-ResumeListItem resume-list__item',

        template: _.template(ResumeListItemTemplate),

        events: {
            'click .HH-ResumeBuilder-ButtonClone': '_clone'
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            var data = {
                id: this.model.get('id'),
                title: this.model.get('title') || 'Без названия',
                status: this.model.get('status').name,
                access: this.model.get('access').type.name,
                updatedAt: Utils.formatUpdateTime(this.model.get('updated')),
                totalViews: this.model.get('total_views'),
                newViews: this.model.get('new_views')
            };
            
            this.$el.html(this.template(data));
            return this;
        },

        _clone: function() {
            this.model.clone();
        }
    });
});
