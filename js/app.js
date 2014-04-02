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
           
        },

        // load: function() {};

        resumeList: function() {
            console.log('Request: resumeList', +new Date())
           
            this.user = new User();
            var headerView = new HeaderView({
                model: this.user,
                parent: this
            });

            $.when(this.user.fetch()).then(function() {
                console.log('User authenticated', +new Date())
                headerView.render();

                if (this.user.isAuthenticated && this.user.isEmployee) {
                    console.log('Starting dict load', +new Date())
                    $.when(
                        this.resumes = new ResumeList(),
                        this.dictionary = new Dictionary(),
                        this.area = new Area(),
                        this.specializations = new SpecializationList()
                    ).then(function() {
                        console.log('End dict load', +new Date())
                       
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
                    }.bind(this));
                }

            }.bind(this), function() {
                console.log('User isn\'t authenticated', +new Date())
                headerView.render();
            });

        
        },

        resume: function(id) {
            this.user = new User();

            var headerView = new HeaderView({
                model: this.user,
                parent: this
            });

            $.when(this.user.fetch()).then(function() {
                console.log('User authenticated', +new Date())
                headerView.render();

                if (this.user.isAuthenticated && this.user.isEmployee) {
                    console.log('Starting dict load', +new Date())
                    $.when(
                        this.resumes = new ResumeList(),
                        this.dictionary = new Dictionary(),
                        this.area = new Area(),
                        this.specializations = new SpecializationList()
                    ).then(function() {
                        console.log('End dict load', +new Date())

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
                        $('.HH-ResumeBuilder-Container').html(resumeView.render().el);
                    }.bind(this));
                }
            }.bind(this), function() {
                console.log('User isn\'t authenticated', +new Date())
                headerView.render();
            });
            console.log('Request: resume', +new Date())
        },

        createResume: function() {
            console.log('Request: createResume', +new Date())

        }

    });

    return Router;

    Backbone.View.extend({
        el: '.HH-ResumeBuilder-Container',

        template: _.template(AppTemplate),

        initialize: function(options) {
            this.resumeId = options.id;
            this.resumes = new ResumeList();


            this.listenTo(this.resumes, 'added', this.load);
            this.load();
        },

        load: function() {
            var that = this;

            this.user.fetch({
                success: function() {
                    $.when(
                        that.resumes.fetch({
                            error: function() {
                                that.user.isEmployee = false;
                                that.render();
                            }
                        }),
                        that.dictionary.fetch(),
                        that.area.fetch(),
                        that.specializations.fetch()
                    ).then(function() {
                        that.render();
                    });
                },

                error: function() {
                    that.render();
                }
            });
        },

        render: function() {
            var headerView = new HeaderView({
                model: this.user,
                parent: this
            });

            headerView.render();

            if (this.user.isAuthenticated && this.user.isEmployee) {
                if (!this.resumes.length) {
                    this.createResume();
                }

                var resumeView = new ResumeView({
                    model: this.resume
                }, {
                    dictionary: this.dictionary,
                    area: this.area,
                    specializations: this.specializations
                });

                this.$el.html(this.template());
                $('.HH-ResumeBuilder-ResumeList').append(resumeView.render().el);
            }
        },

        createResume: function() {
            this.resume = new Resume({
                url: [Config.apiUrl, 'resumes'].join('/')
            });
            this.resumes.add(this.resume);

            var resumeView = new ResumeView({
                model: this.resume
            }, {
                dictionary: this.dictionary,
                area: this.area,
                specializations: this.specializations
            });

            this.$el.html(this.template());
            $('.HH-ResumeBuilder-Resume').append(resumeView.render().el);
        }
    });
});