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
    'views/header',
    'config',
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
    HeaderView,
    ResumeListView,
    Config,
    AppTemplate
) {
    'use strict';

    var getCookie = function(cookieName) {
        var cookieValue = '';
        document.cookie.split(';').some(function(cookie) {
            var cookieData = cookie.split('=');
            if (cookieData[0].trim() === cookieName) {
                cookieValue = cookieData[1];
                return true;
            }
        }, this);
        return cookieValue;
    };

    var ACCESS_TOKEN = getCookie('access_token');
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader(
                'Authorization',
                ['Bearer', ACCESS_TOKEN].join(' ')
            );
        }
    });

    return Backbone.View.extend({
        el: '.HH-ResumeBuilder-Container',

        template: _.template(AppTemplate),

        initialize: function() {
            this.user = new User();
            this.resumes = new ResumeList();
            this.dictionary = new Dictionary();
            this.area = new Area();
            this.specializations = new SpecializationList();
            this.resume = {};

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
                        that.resume = _.extend(new Resume(), _.omit(that.resumes.first().attributes, ['id']));
                        that.resume.set('url', that.resumes.first().get('url'));
                        that.render();
                    });
                },

                error: function() {
                    that.render();
                }
            });
        },

        render: function() {
            var headerView,
                resumeView;

            headerView = new HeaderView({
                model: this.user,
                parent: this
            });

            var resumeView, resumeListView;

            resumeListView = new ResumeListView({
                collection: this.resumes
            });

            resumeView = new ResumeView({
                model: this.resume
            }, {
                dictionary: this.dictionary,
                area: this.area,
                specializations: this.specializations
            });

            headerView.render();

            if (this.user.isAuthenticated && this.user.isEmployee) {
                if (!this.resumes.length) {
                    this.createResume();
                }

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
        },

        createResume: function() {
            this.resumes.add(new Resume({
                url: [Config.apiUrl, 'resumes'].join('/')
            }));

            this.$el.html(this.template());
            this.$el.find('.HH-ResumeBuilder-Resume').append(resumeView.render().el);

            this.$el.find('.HH-ResumeBuilder-ResumeList').append(resumeListView.render().el)
        }
    });
});