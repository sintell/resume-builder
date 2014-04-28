define([
    'jquery',
    'underscore',
    'backbone',
    'views/resumeSection',
    'views/educationList',
    'views/languageList',
    'views/educationLevel',
    'text!templates/educationSection.html'
], function(
    $,
    _,
    Backbone,
    ResumeSection,
    EducationListView,
    LanguageListView,
    EducationLevelView,
    EducationSectionTemplate
) {
    'use strict';

    return ResumeSection.extend({
        namespace: 'education',

        template: _.template(EducationSectionTemplate),


        initialize: function(options) {
            ResumeSection.prototype.initialize.apply(this, [options]);

            $.extend(options, {resume: this.model});

            this.components.push(new EducationLevelView(options));
            this.components.push(new EducationListView(options));
            this.components.push(new LanguageListView(options));
        },

        render: function() { 
           return ResumeSection.prototype.render.apply(this, arguments);
        },

        refreshEducationList: function() {
            console.log(1)
            this.model.trigger('refreshEducationList');
        }
    });
});
