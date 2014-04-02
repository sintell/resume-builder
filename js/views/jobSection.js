define([
    'jquery',
    'underscore',
    'backbone',
    'views/resumeSection',
    'views/profarea',
    'views/relocation',
    'views/relocationArea',
    'text!templates/jobSection.html'
], function(
    $,
    _,
    Backbone,
    ResumeSection,
    ProfareaView,
    RelocationView,
    RelocationAreaView,
    JobSectionTemplate
) {
    'use strict';

    return ResumeSection.extend({
        namespace: 'job_and_salary',

        template: _.template(JobSectionTemplate),

        initialize: function(options) {
            ResumeSection.prototype.initialize.apply(this, [options]);

            $.extend(options, {resume: this.model});

            this.components.push(new ProfareaView(options));
            this.components.push(new RelocationView(options));
            this.components.push(new RelocationAreaView(options));
        },

        render: function(data) {
            return ResumeSection.prototype.render.apply(this, arguments);
        }
    });
});
