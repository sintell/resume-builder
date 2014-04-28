define([
    'jquery',
    'underscore',
    'backbone',
    'views/education',
    'text!templates/educationList.html'
], function(
    $,
    _,
    Backbone,
    EducationView,
    EducationListTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(EducationListTemplate),

        componentName: 'education-list',

        events: {
            'click .HH-ResumeSection-AddEducation': '_addEducation'
        },

        initialize: function(options) {
            this.options = options;
            this.listenTo(options.resume, 'refreshEducationList', this._refreshEducationList);
        },

        render: function() {
            var data = $.extend(this.model.attributes, {
                educationLevel: this.educationLevel
            });

            this.$el.html(this.template(data));

            this.$('.HH-ResumeSection-Educations').append(this.education[this.educationLevel].map(function(education) {
                return education.render().el;
            }));

            return this;
        },

        fill: function(attributes) {
            var that = this;
            this.educationLevel = (this.model.get('education').level.id !== 'secondary') ?
                'primary' :
                'elementary';


            if (!this.education) {
                this.education = {};
            }

            if (!this.education[this.educationLevel]) {
                this.education[this.educationLevel] = [];
            }

            this.education[this.educationLevel] = attributes.education[this.educationLevel].map(function (education) {
                return new EducationView($.extend(
                    {},
                    that.options, {
                        model: new Backbone.Model(education),
                        grade: that.educationLevel
                    }
                ));
            });
        },

        takeback: function(attributes) {
            var that = this;
            attributes.education = attributes.education || {};
            attributes.education[this.educationLevel] = attributes.education[this.educationLevel] || [];

            this.education[this.educationLevel].forEach(function(education) {
                var $name = education.$('.HH-EducationControl-NameInput'),
                    $organization = education.$('.HH-EducationControl-OrganizationInput'),
                    $result = education.$('.HH-EducationControl-ResultInput'),
                    $year = education.$('.HH-EducationControl-YearInput');

                if (!education.removed) {
                    if (that.educationLevel === 'elementary') {
                        attributes.education[that.educationLevel].push({
                            name: $name.val(),
                            year: $year.val()
                        });
                    } else {
                        attributes.education[that.educationLevel].push({
                            name: $name.val(),
                            organization: $organization.val(),
                            result: $result.val(),
                            year: $year.val()
                        });
                    }
                }

            });
            attributes.education.level = {id: 'secondary'};
        },

        _addEducation: function() {
            var education;

            education = new EducationView($.extend(
                {},
                this.options, {
                    model: new Backbone.Model(),
                    grade: this.educationLevel
                }
            ));

            this.education[this.educationLevel].push(education);
            this.$('.HH-ResumeSection-Educations').append(education.render().el);
            education.$('.HH-ResumeSection-Control').toggleClass('control_viewing control_editing');
        },

        _refreshEducationList: function() {
            this.fill(this.model);
            this.render();
        }
    });
});
