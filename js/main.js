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
    'views/resumeList',
    'views/header',
    'models/user',
    'models/resume',
    'config'
], function($, Backbone, App, ResumeList, ResumeListView, HeaderView, User) {
    'use strict';

    var Router = Backbone.Router.extend({
        routes: {
            '': 'resumeList',
            ':id': 'resume',
        },

        resumeList: function() {
            var user = new User();
            var resumes = new ResumeList();
            var resumeListView = new ResumeListView({
                collection: resumes
            });
            var headerView = new HeaderView({
                model: user,
                parent: this
            });
            user.fetch({
                success: function() {
                    $.when(resumes.fetch()).then(function() {
                        headerView.render();
                        $('.HH-ResumeBuilder-Container').html(resumeListView.render().el);                        
                    });
                },

                error: function() {
                    headerView.render();
                }
            });

        },

        resume: function(id) {
            var app = new App({id: id});    
        },

        createResume: function() {
            this.navigate("new", {trigger: true});
        }
    });

    new Router();
    Backbone.history.start();

    
});