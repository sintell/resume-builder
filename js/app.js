define([
    'jquery',
    'underscore',
    'backbone',
    'models/resume',
    'models/dictionary',
    'models/area',
    'models/user',
    'collections/resumeList',
    'collections/specializationList',
    'views/resume',
    'views/resumeList',
    'views/header',
    'config',
    'utils',
    'text!templates/app.html'
], function(
    $,
    _,
    Backbone,
    Resume,
    Dictionary,
    Area,
    User,
    ResumeList,
    SpecializationList,
    ResumeView,
    ResumeListView,
    HeaderView,
    Config,
    Utils,
    AppTemplate
) {
    'use strict';

    var ACCESS_TOKEN = Utils.getCookie('access_token');
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader(
                'Authorization',
                ['Bearer', ACCESS_TOKEN].join(' ')
            );
        }
    });


    var Router = Backbone.Router.extend({
        routes: {
            '': 'resumeList',
            'list': 'resumeList',
            ':id': 'resume'
        },

        initialize: function(options) {
            console.log('Starting router', +new Date())
            this.user = new User();
            var headerView = new HeaderView({
                model: this.user,
                parent: this
            });

            $.when(this.user.fetch()).then(function() {
                console.log('User authenticated', +new Date())
                headerView.render();

                $.when(
                    this.resumes = new ResumeList(),
                    this.dictionary = new Dictionary(),
                    this.area = new Area(),
                    this.specializations = new SpecializationList()
                ).then(function() {
                    Backbone.history.start();
                });
            }.bind(this), function() {
                console.log('User isn\'t authenticated', +new Date())
                headerView.render();
            });
           
        },

        resumeList: function() {
            console.log('Request: resumeList', +new Date())
            if (this.user.isAuthenticated && this.user.isEmployee) {
                var resumeListView = new ResumeListView({
                    collection: this.resumes
                });

                $.when(this.resumes.fetch()).then(function() {
                    console.log(resumeListView.render().el);
                    $('.HH-ResumeBuilder-Container')
                        .html(resumeListView.render().el);
                });
            }               
        },

        resume: function(id) {
            console.log('Request: resume', +new Date())
            if (this.user.isAuthenticated && this.user.isEmployee) {                

                if (id !== 'new') {
                    this.resume = new Resume({id: id}); 
                } else {
                    this.createResume();
                }

                var resumeView = new ResumeView({
                    model: this.resume
                }, {
                    dictionary: this.dictionary,
                    area: this.area,
                    specializations: this.specializations
                });
                console.log(resumeView)
                $('.HH-ResumeBuilder-Container')
                    .html(resumeView.render().el);
            }
        },

        createResume: function() {
            console.log('Request: createResume', +new Date());

        }

    });

    return Router;

});