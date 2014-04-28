define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/educationLevel.html'
], function(
    $,
    _,
    Backbone,
    EducationLevelTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(EducationLevelTemplate),

        componentName: 'education-level',

        events: {
            'change .HH-EducationControl-LevelSelect': '_refreshEducationList'
        },

        initialize: function(options) {
            this.options = options;
        },

        render: function() {
            var data = $.extend(this.model.attributes, {
                educationLevel: this.educationLevel,
                dictionary: this.options.dictionary.attributes
            });

            this.$el.html(this.template(data));

            return this;
        },

        fill: function(attributes) {
        
        },

        takeback: function(attributes) {
            var that = this;
            attributes.education = attributes.education || {};
            attributes.education.level = attributes.education.level || {id: 'primary'};

            var $level = this.$('.HH-EducationControl-LevelSelect').find('option:selected');

            attributes.education.level = {
                id: $level.val()
            };
        },

        _refreshEducationList: function(event) {
            var value = this.$('.HH-EducationControl-LevelSelect')
                .find('option:selected').val();

            this.model.trigger('refreshEducationList', value);
        }
    });
});
