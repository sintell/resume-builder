define([
    'jquery',
    'underscore',
    'backbone',
    'views/experienceItem',
    'text!templates/experience.html',
    'text!templates/experienceItemContainer.html'
], function($, _, Backbone, ExperienceItem, ExperienceTemplate, ExperienceContainerTemplate) {
    'use strict';

    return Backbone.View.extend({
        className: 'HH-ResumeSection-Component-Experience',

        componentName: 'experience',

        template: _.template(ExperienceTemplate),

        containerTemplate: _.template(ExperienceContainerTemplate),

        events: {
            'click .HH-Experience-Add': '_addExperience'
        },

        initialize: function(options) {
            this.options = options;

            this.industries = options.industries.models.map(function(model) {
                return model.attributes;
            });
        },

        fill: function(attributes) {
            var that = this;
            this.experienceItems = [];

            this.experiences = attributes.experience || [];

            this.experienceItems = this.experiences.map(function(item, index) {
                return new ExperienceItem(item, that.options, index);
            });
        },

        render: function() {
            var that = this,
                data = {
                    experiences: this.experiences,
                    industries: this.industries
                };

            this.$el.html(this.template(data));

            this.container = this.$('.HH-Experience-Item-Container');

            this.experienceItems.forEach(that._bindAndRenderExperience.bind(that));

            return this;
        },

        takeback: function(attributes) {
            attributes.experience = [];

            this.experienceItems.forEach(function(item) {
                item.takeback(attributes);
            });
        },

        _bindAndRenderExperience: function(experience, index) {
            var that = this;

            var $elementContainer = $(this.containerTemplate({
                index: index
            }));

            this.container.append($elementContainer);

            experience.setElement($elementContainer);
            experience.render();

            experience.$('.HH-Experience-Item-Remove').on('click', function(event) {
                var index = $(event.currentTarget).data('hh-index');

                that.experienceItems.splice(index, 1);
                that.$('[data-hh-experience-index=' + index +']').remove();
            });
        },

        _addExperience: function() {
            var index = this.experienceItems.length;

            var experience = new ExperienceItem({}, this.options, index);
            this.experienceItems.push(experience);

            this._bindAndRenderExperience(experience, index);
        }
    });
});
