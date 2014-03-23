requirejs.config({
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        text: 'lib/text',
        templates: '../templates',
        config: '../config/config'
    }
});

requirejs([
    'jquery',
    'backbone',
    'app',
    'collections/resumeList',
    'views/resumeList'
], function($, Backbone, App, ResumeList, ResumeListView) {
    'use strict';

    var router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'resumes': 'resumeList',
            '/resumes/:id': 'resume'
        },
        index: function() {
            var app = new App();    
        },

        resumeList: function() {
            var resumes = new ResumeList();
            var resumeListView = new ResumeListView({
                collection: resumes
            });
            resumes.fetch();
            $('.HH-ResumeBuilder-Container').append(resumeListView.render().el)
        },

        resume: function(id) {
            console.log(id)
        }
    });

    new router;
    Backbone.history.start();

    
});