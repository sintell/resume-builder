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
    'collections/languageList',
    'collections/industryList',
    'views/resume',
    'views/resumeList',
    'views/header',
    'config',
    'utils'
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
    LanguageList,
    IndustryList,
    ResumeView,
    ResumeListView,
    HeaderView,
    Config,
    Utils
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

    return Backbone.Router.extend({
        routes: {
            '': 'showResumeList',
            ':id': 'showResume'
        },

        initialize: function() {
            var that = this;
            
            this.user = new User();
            this.headerView = new HeaderView({model: this.user});
            this.listenTo(this.headerView, 'createResume', this.createResume);
            this.resumes = new ResumeList();
            this.dictionary = new Dictionary();
            this.area = new Area();
            this.specializations = new SpecializationList();
            this.languages = new LanguageList();
            this.industries = new IndustryList();

            this.user.fetch().then(function() {
                that.headerView.render();

                $.when(
                    that.resumes.fetch(),
                    that.dictionary.fetch(),
                    that.area.fetch(),
                    that.specializations.fetch(),
                    that.languages.fetch(),
                    that.industries.fetch()
                ).then(function() {
                    Backbone.history.start({pushState: true});
                    that.listenTo(that.resumes, 'added', that.handleAdded);
                });
            }, function() {
                that.headerView.render();

                that.user.isEmployee = false;
            });
        },

        showResumeList: function() {
            var that = this;

            if (this.user.isAuthenticated && this.user.isEmployee) {
                var resumeListView = new ResumeListView({
                    collection: this.resumes
                });

                $.when(this.resumes.fetch()).then(function() {
                    if (that.resumes.length === 1) {
                        that.navigate(that.resumes.first().id, {trigger: true});
                    } else {
                        that.headerView.render();

                        $('.HH-ResumeBuilder-Container').html(resumeListView.render().el);
                    }
                });
            }               
        },

        showResume: function(id) {
            if (this.user.isAuthenticated && this.user.isEmployee) {
                if (id !== 'new') {
                    this.resume = new Resume({id: id}, {collection: this.resumes});
                } else {
                    return this.createResume();
                }

                this.headerView.render({linkToList: (this.resumes.length > 1)});

                var resumeView = new ResumeView({
                    model: this.resume
                }, {
                    dictionary: this.dictionary,
                    area: this.area,
                    specializations: this.specializations,
                    languages: this.languages,
                    industries: this.industries
                });

                $('.HH-ResumeBuilder-Container').html(resumeView.render().el);
            }
        },

        createResume: function() {
            this.navigate('new');
            this.resume = new Resume({
                contact: [{
                    type: {id: 'email'},
                    value: this.user.get('email'),
                    preferred: true
                }]
            });
            this.resumes.add(this.resume);

            this.headerView.render({linkToList: true});

            var resumeView = new ResumeView({
                model: this.resume
            }, {
                dictionary: this.dictionary,
                area: this.area,
                specializations: this.specializations,
                languages: this.languages,
                industries: this.industries
            });

            $('.HH-ResumeBuilder-Container').html(resumeView.render().el);
        },

        handleAdded: function(event, options) {
            var id;

            switch(event) {
                case 'new': {
                    id = options.newUrl.split('/')[2];
                    this.resume.set('id', id);
                    this.navigate(id, {trigger: true});
                    break;
                }

                case 'clone': {
                    id = options.newUrl.split('/')[2];
                    this.navigate(id, {trigger: true});
                    break;
                }
            }
        }
    });
});
