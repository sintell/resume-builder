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

            this.profareaView = new ProfareaView(options);
            this.components.push(this.profareaView);
            this.components.push(new RelocationView(options));
            this.components.push(new RelocationAreaView(options));
        },

        render: function() {
            var result;

            result = ResumeSection.prototype.render.apply(this, arguments);
            this.bindStartCareerCheckbox();

            return result;
        },

        bindStartCareerCheckbox: function() {
            var that = this,
                $checkbox;

            $checkbox = this.$('.HH-ResumeSection-CareerStartCheckbox');

            $checkbox.off('change').on('change', function(event) {
                that.model.set('careerStart', this.checked);
                if (this.checked) {
                    that.profareaView.updateSpecializationList(that.model.const.CAREER_START_PROFAREA, true);
                }
            });

            this.listenTo(this.profareaView, 'profarea:change', function(id) {
                that.model.set('careerStart', id === that.model.const.CAREER_START_PROFAREA);
                $checkbox.prop('checked', id === that.model.const.CAREER_START_PROFAREA);
            });
        }
    });
});
