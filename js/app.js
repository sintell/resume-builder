define([
    'jquery',
    'underscore',
    'backbone',
    'models/resume',
    'models/dictionary',
    'models/area',
    'collections/resume_list',
    'collections/specialization_list',
    'views/resume',
], function($, _, Backbone, Resume, Dictionary, Area, ResumeList, SpecializationList, ResumeView) {
    'use strict';

    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader(
                'Authorization',
                'Bearer MGDGK21AJ75KJP0VABVRU3RN1H883IQUTOPLNU715R9G34TOAQ93FIIEEV2DAV12'
            );
        }
    });

    return Backbone.View.extend({
        el: '.HH-ResumeBuilder-Container',

        template: _.template($('#HH-ResumeBuilder-AppTemplate').html()),

        initialize: function() {
            var that = this;

            this.resumes = new ResumeList();
            this.dictionary = new Dictionary();
            this.area = new Area();
            this.specializations = new SpecializationList();

            this.listenTo(this.resumes, 'sync', this.render);

            $.when(
                this.resumes.fetch(),
                this.dictionary.fetch(),
                this.area.fetch(),
                this.specializations.fetch()
            ).then(function() {
                if (that.resumes.length) {
                    that.resumes.first().fetch();
                } else {
                    // TODO создать новое резюме
                }
            });
        },

        render: function() {
            var resumeView;

            resumeView = new ResumeView({
                model: this.resumes.first()
            }, {
                dictionary: this.dictionary,
                area: this.area,
                specializations: this.specializations
            });

            this.$el.html(this.template());
            this.$el.find('.HH-ResumeBuilder-ResumeList').append(resumeView.render().el);
        }
    });
});