define([
    'jquery',
    'underscore',
    'backbone',
    'views/resumeSection',
    'views/skillSet',
    'text!templates/experienceSection.html',
], function(
    $,
    _,
    Backbone,
    ResumeSection,
    SkillSetView,
    ExperienceSectionTemplate
) {
    'use strict';

    return ResumeSection.extend({
        namespace: 'experience',

        template: _.template(ExperienceSectionTemplate),

        initialize: function(options) {
            ResumeSection.prototype.initialize.apply(this, [options]);

            $.extend(options, {resume: this.model});

            this.components.push(new SkillSetView(options));
        },

        render: function(data) {
            return ResumeSection.prototype.render.apply(this, arguments);
        }
    });
});
