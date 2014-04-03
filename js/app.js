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

    return Backbone.View.extend({
        el: '.HH-ResumeBuilder-Container',

        template: _.template(AppTemplate),

        initialize: function(options) {
            this.resumeId = options.id;
            this.user = new User();
            this.resumes = new ResumeList();
            this.dictionary = new Dictionary();
            this.area = new Area();
            this.specializations = new SpecializationList();

            if (this.resumeId !== 'new') {
                this.resume = new Resume({id: this.resumeId}); 
            } else {
                this.createResume();
            }

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