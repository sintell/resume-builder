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
            ':id': 'resume'
        },

        initialize: function(options) {
            this.user = new User();
            var headerView = new HeaderView({
                model: this.user,
                parent: this
            });

            this.resumes = new ResumeList();
            this.dictionary = new Dictionary();
            this.area = new Area();
            this.specializations = new SpecializationList();

            var that = this;

            $.when(this.user.fetch()).then(function() {
                headerView.render();

                $.when(
                    that.resumes.fetch(),
                    that.dictionary.fetch(),
                    that.area.fetch(),
                    that.specializations.fetch()
                ).then(function() {
                    Backbone.history.start({pushState: true});
                    that.listenTo(that.resumes, 'added', that.handleAdded);

                });
            }, function() {
                headerView.render();
            });


        },

        resumeList: function() {
            if (this.user.isAuthenticated && this.user.isEmployee) {
                var resumeListView = new ResumeListView({
                    collection: this.resumes
                });

                $.when(this.resumes.fetch()).then(function() {
                    $('.HH-ResumeBuilder-Container')
                        .html(resumeListView.render().el);
                });
            }               
        },

        resume: function(id) {
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
                $('.HH-ResumeBuilder-Container')
                    .html(resumeView.render().el);
            }
        },

        createResume: function() {
            this.navigate('new');
            this.resume = new Resume();
            this.resumes.add(this.resume);

            var resumeView = new ResumeView({
                model: this.resume
            }, {
                dictionary: this.dictionary,
                area: this.area,
                specializations: this.specializations
            });

            $('.HH-ResumeBuilder-Container')
                    .html(resumeView.render().el);
        },

        handleAdded: function(event, options) {
            console.log(arguments);
            switch(event) {
                case 'new': {
                    this.resume.set('id', options.newUrl.split('/')[2]);
                    this.navigate(options.newUrl.split('/')[2], {trigger:true});
                    break;
                }

                case 'clone': {

                    this.navigate('/');
                    this.resumeList();
                }
            }
        }

    });

    return Router;
});