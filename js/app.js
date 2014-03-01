define([
    'jquery',
    'underscore',
    'backbone',
    'models/resume',
    'models/dictionary',
    'collections/resume_list',
    'collections/specialization_list',
    'views/resume',
], function($, _, Backbone, Resume, Dictionary, ResumeList, SpecializationList, ResumeView) {
    'use strict';

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

            this.resumes = new ResumeList();
            this.dictionary = new Dictionary();
            this.specializations = new SpecializationList();

            this.listenTo(this.resumes, 'sync', this.render);

            $.when(this.resumes.fetch(),
                   this.dictionary.fetch(),
                   this.specializations.fetch()).then(function() {
                if (that.resumes.length > 0) {
                    that.resumes.first().fetch();
                } else {
                    // TODO создать новое резюме
                }
            });
        },

        render: function() {
            var resumeView;

            resumeView = new ResumeView({
                model: this.resumes.first(),
            }, {
                dictionary: this.dictionary,
                specializations: this.specializations
            });

            this.$el.html(this.template());
            this.$el.find('.HH-ResumeBuilder-ResumeList').append(resumeView.render().el);
        }
    });
});