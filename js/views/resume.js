define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        template: _.template($('#HH-ResumeBuilder-ResumeTemplate').html()),

        events: {
            'click .HH-ResumeSection-Switch': 'edit',
            'click .HH-ResumeSection-Submit': 'submit'
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));
            
            return this;
        },

        edit: function(event) {
            var $controls,
                $section;

            event.preventDefault();

            $section = $(event.currentTarget).closest('.HH-Resume-ResumeSection');
            $controls = $section.find('.HH-ResumeSection-Control, .HH-ResumeSalarySection-Control');
            $controls.toggleClass('control_viewing').toggleClass('control_editing');
        },

        submit: function(event) {
            var $section,
                attributes,
                that;

            event.preventDefault();

            that = this;
            attributes = {
                salary: {}
            };
            $section = $(event.currentTarget).closest('.HH-Resume-ResumeSection');
            $section.find('.HH-ResumeSection-ControlInput').each(function(index, input) {
                attributes[input.getAttribute('name')] = input.value;
            });
            $section.find('.HH-ResumeSalarySection-ControlInput').each(function(index, input) {
                attributes.salary[input.getAttribute('name')] = input.value;
            });

            this.model.save(attributes, {patch: true});
        }
    });
});