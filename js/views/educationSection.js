define([
    'jquery',
    'underscore',
    'backbone',
    'views/resumeSection',
    'views/languageList',
    'text!templates/educationSection.html'
], function(
    $,
    _,
    Backbone,
    ResumeSection,
    LanguageListView,
    EducationSectionTemplate
) {
    'use strict';

    return ResumeSection.extend({
        namespace: 'education',

        template: _.template(EducationSectionTemplate),

        initialize: function(options) {
            ResumeSection.prototype.initialize.apply(this, [options]);

            $.extend(options, {resume: this.model});

            this.components.push(new LanguageListView(options));
        },

        render: function() {
            return ResumeSection.prototype.render.apply(this, arguments);
        }
    });
});
