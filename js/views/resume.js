define([
    'jquery',
    'underscore',
    'backbone',
    'models/validator',
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
    Validator
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

        events: {
            'blur *[data-hh-name]': '_validateInput',
            'change *[data-hh-name]': '_validateInput'
        },

        initialize: function(attributes, options) {
            var that = this;

            _.bindAll(this, 'data');

            this.dictionary = options.dictionary;

            this.listenTo(this.model, 'load', function() {
                that.initializeSections($.extend(options, {model: this.model, data: this.data}));
                that.render();
            });

            this.sidebar = new StatusSidebarView({
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
        },

        _validateInput: function(event) {
            var target = $(event.target);
            var section = $(event.currentTarget);
            var name = target.data('hh-name');

            var error = this.model.validator.validateField({
                name: name,
                value: target.val()
            });

            section.find('.error-text').remove();
            if(typeof error !== 'undefined') {
                section.addClass('section_with_error');
                target.addClass('control_with_error');
                section.append('<div class="error-text">' + error + '</div>');
                $('.HH-ResumeSection-Submit:visible').attr('disabled', true);
            } else {
                section.removeClass('section_with_error');
                target.removeClass('control_with_error');
                $('.HH-ResumeSection-Submit:visible').attr('disabled', true);
            }
        }
    });
});