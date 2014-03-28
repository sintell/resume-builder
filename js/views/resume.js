define([
    'jquery',
    'underscore',
    'backbone',
    'views/header',
    'views/sideBar',
    'views/additionalInfo',
    'views/personalSection',
    'views/jobSection',
    'views/accessSection',
    'text!templates/resume.html'
], function(
    $,
    _,
    Backbone,
    HeaderView,
    SideBarView,
    AdditionalInfoView,
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

            this.dictionary = options.dictionary;

            this.listenTo(this.model, 'load', function() {
                that.initializeSections($.extend(options, {model: this.model, parent: this}));
                that.render();
            });

            new SideBarView({
                model: this.model
            });
            new AdditionalInfoView({
                model: this.model
            });

            this.model.load();
        },

        initializeSections: function(options) {
            this.sections = [];
            this.sections.push(new PersonalSection(options));
            this.sections.push(new JobSection(options));
            this.sections.push(new AccessSection(options));
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