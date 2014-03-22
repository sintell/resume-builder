define([
    'jquery',
    'underscore',
    'backbone',
    'models/resume',
    'models/dictionary',
    'models/area',
    'collections/resumeList',
    'collections/specializationList',
    'views/resume',
    'text!templates/app.html'
], function($, _, Backbone, Resume, Dictionary, Area, ResumeList, SpecializationList, ResumeView, AppTemplate) {
    'use strict';

    var getCookie = function(cookieName) {
        var cookieValue = '';
        document.cookie.split(';').forEach(function(cookie) {
            var cookieData = cookie.split('=');
            if ( cookieData[0] === cookieName ) {
                cookieValue = cookieData[1];
            }
        }, this);
        return cookieValue;
    };

    var ACCESS_TOKEN = getCookie('access_token');
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader(
                'Authorization',
                ['Bearer ', ACCESS_TOKEN].join(' ')
            );
        }
    });

    return Backbone.View.extend({
        el: '.HH-ResumeBuilder-Container',

        template: _.template(AppTemplate),

        initialize: function() {
            var that = this;


            this.resumes = new ResumeList();
            this.dictionary = new Dictionary();
            this.area = new Area();
            this.specializations = new SpecializationList();

            $.when(
                this.resumes.fetch(),
                this.dictionary.fetch(),
                this.area.fetch(),
                this.specializations.fetch()
            ).then(function() {
                // TODO создать новое резюме
                that.render();
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