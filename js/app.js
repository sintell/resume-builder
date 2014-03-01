define([
    'jquery',
    'underscore',
    'backbone',
    'models/resume',
    'models/dictionary',
    'collections/resume_list',
    'views/resume'
], function($, _, Backbone, Resume, Dictionary, ResumeList, ResumeView) {
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
            var resumePremise,
                dictionaryPremise,
                that = this;

            this.resumes = new ResumeList();
            this.listenTo(this.resumes, 'sync', this.render);
            resumePremise = this.resumes.fetch();

            this.dictionary = new Dictionary();
            dictionaryPremise = this.dictionary.fetch();

            $.when(resumePremise, dictionaryPremise).then(function() {
                if (that.resumes.length > 0) {
                    that.resumes.first().fetch();
                } else {
                    // TODO создать новое резюме
                }
            });
        },

        render: function() {
            var view = new ResumeView({
                model: this.resumes.first(),
            }, {
                dictionary: this.dictionary
            });

            this.$el.html(this.template());
            this.$el.find('.HH-ResumeBuilder-ResumeList').append(view.render().el);
        }
    });
});