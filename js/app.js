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
    AppTemplate
) {
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

            this.user = new User();
            this.resumes = new ResumeList();
            this.dictionary = new Dictionary();
            this.area = new Area();
            this.specializations = new SpecializationList();

            this.user.fetch({
                success: function() {
                    $.when(
                        that.resumes.fetch(),
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
            var headerView,
                resumeView;

            headerView = new HeaderView({
                model: this.user
            });
            headerView.render();

            if (this.user.authenticated) {
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
        }
    });
});