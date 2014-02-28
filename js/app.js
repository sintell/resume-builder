define([
    'jquery',
    'underscore',
    'backbone',
    'collections/resume_list',
    'models/resume',
    'views/resume'
], function($, _, Backbone, ResumeList, Resume, ResumeView) {
    'use strict';

    // HH API не поддерживает HTTP PATCH, поэтому заменяем его на PUT
    var originalSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
        if (method === 'patch') {
            options.type = 'PUT';
        }
        return originalSync(method, model, options);
    };

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
            xhr.setRequestHeader('Authorization', 'Bearer R2D3SLBP5JR1VO7JULE5R0BCMDBJFOC6RVFGOL0KDN37A1IRHAJRRSFLJLMO1BR8');
        }
    });

    return Backbone.View.extend({
        el: '.HH-ResumeBuilder-Container',

        template: _.template($('#HH-ResumeBuilder-AppTemplate').html()),

        initialize: function() {
            var that = this;

            this.collection = new ResumeList();
            this.listenTo(this.collection, 'sync', this.render);
            this.collection.fetch({
                success: function() {
                    if (that.collection.length > 0) {
                        that.collection.first().fetch();
                    } else {
                        // TODO создать новое резюме
                    }
                }
            });
        },

        render: function() {
            var view = new ResumeView({
                model: this.collection.first()
            });

            this.$el.html(this.template());
            this.$el.find('.HH-ResumeBuilder-ResumeList').append(view.render().el);
        }
    });
});