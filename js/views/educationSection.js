define([
    'jquery',
    'underscore',
    'backbone',
    'views/resumeSection',
    'text!templates/educationSection.html'
], function(
    $,
    _,
    Backbone,
    ResumeSection,
    EducationSectionTemplate
) {
    'use strict';

    return ResumeSection.extend({
        namespace: 'education',

        template: _.template(EducationSectionTemplate),

        initialize: function(options) {
            ResumeSection.prototype.initialize.apply(this, [options]);

            $.extend(options, {resume: this.model});
        },

        render: function(data) {
            return ResumeSection.prototype.render.apply(this, arguments);
        }
    });
});
