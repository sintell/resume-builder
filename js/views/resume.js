define([
    'jquery',
    'underscore',
    'backbone',
    'views/header',
    'views/statusSidebar',
    'views/infoSidebar',
    'views/personalSection',
    'views/jobSection',
    'views/accessSection',
    'text!templates/resume.html'
], function(
    $,
    _,
    Backbone,
    HeaderView,
    StatusSidebarView,
    InfoSidebarView,
    PersonalSection,
    JobSection,
    AccessSection,
    ResumeTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(ResumeTemplate),

        initialize: function(attributes, options) {
            var that = this;

            _.bindAll(this, 'data');

            this.dictionary = options.dictionary;

            this.listenTo(this.model, 'load', function() {
                that.initializeSections($.extend(options, {model: this.model, data: this.data}));
                that.render();
            });

            this.sidebar = new SideBarView({
                model: this.model
            });
            new InfoSidebarView({
                model: this.model
            });

            this.model.load();
        },

        initializeSections: function(options) {
            var extraOptions = $.extend({}, options, {
                    sidebar: this.sidebar
            });

            this.sections = [];
            this.sections.push(new PersonalSection(extraOptions));
            this.sections.push(new JobSection(extraOptions));
            this.sections.push(new AccessSection(extraOptions));
        },

        render: function() {
            var data = this.data(),
                that = this;

            if (!this.model.ready) {
                return this;
            }

            this.$el.html(this.template(data));
            this.sections.forEach(function(section) {
                var container = that.$el.find([
                    '.HH-ResumeSection-Container[data-hh-namespace="',
                    section.namespace,
                    '"]'
                ].join(''));

                section.title = container.data('hh-title');
                container.html(section.render(data).el);
                container.contents().unwrap();
            });

            return this;
        },

        data: function() {
            return {
                resume: this.model.attributes,
                dictionary: this.dictionary.attributes,
                conditions: this.model.conditions.attributes
            };
        }
    });
});