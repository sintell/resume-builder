define([
    'jquery',
    'underscore',
    'backbone',
    'views/resumeSection',
    'views/phone',
    'views/email',
    'text!templates/contactSection.html'
], function(
    $,
    _,
    Backbone,
    ResumeSection,
    Phone,
    Email,
    ContactsSectionTemplate
) {
    'use strict';

    return ResumeSection.extend({
        className: 'HH-Resume-ResumeSection',

        namespace: 'contact',

        template: _.template(ContactsSectionTemplate),

        initialize: function(options) {
            var that = this;

            ResumeSection.prototype.initialize.apply(this, [options]);

            $.extend(options, {resume: this.model});

            this.components.push(new Email($.extend({}, options, {
                componentName: 'email',
                contactType: 'email'
            })));
            ['cell', 'home', 'work'].forEach(function(phone) {
                that.components.push(new Phone($.extend({}, options, {
                    componentName: phone,
                    contactType: 'phone'
                })));
            });

            this.components.forEach(function(component) {
                that.listenTo(component, 'preferredRemoved', that.resetPreferred);
            });
        },

        render: function() {
            return ResumeSection.prototype.render.apply(this, arguments);
        },

        resetPreferred: function() {
            this.$('.HH-Contact-Preferred:first').prop('checked', true);
        }
    });
});
