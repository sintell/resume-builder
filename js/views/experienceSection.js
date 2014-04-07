define([
    'jquery',
    'underscore',
    'backbone',
    'views/resumeSection',
    'views/skillSet',
    'views/experience',
    'text!templates/experienceSection.html',
], function(
    $,
    _,
    Backbone,
    ResumeSection,
    SkillSetView,
    ExperienceView,
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
            this.components.push(new ExperienceView(options));
        },

        render: function(data) {
            return ResumeSection.prototype.render.apply(this, arguments);
        }
    });
});
