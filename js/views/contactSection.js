define([
    'jquery',
    'underscore',
    'backbone',
    'views/resumeSection',
    'views/contact',
    'text!templates/contactSection.html',
], function(
    $,
    _,
    Backbone,
    ResumeSection,
    Contact,
    ContactsSectionTemplate
) {
    'use strict';

    return ResumeSection.extend({
        className: 'HH-Resume-ResumeSection',

        namespace: 'contact',

        template: _.template(ContactsSectionTemplate),

        initialize: function(options) {
            ResumeSection.prototype.initialize.apply(this, [options]);

            $.extend(options, {resume: this.model});

            this.components.push(new Contact($.extend({}, options, {
                componentName: 'cell',
                contactType: 'phone'
            })));
            this.components.push(new Contact($.extend({}, options, {
                componentName: 'home',
                contactType: 'phone'
            })));
            this.components.push(new Contact($.extend({}, options, {
                componentName: 'work',
                contactType: 'phone'
            })));
            this.components.push(new Contact($.extend({}, options, {
                componentName: 'email',
                contactType: 'email'
            })));
        },

        render: function(data) {
            return ResumeSection.prototype.render.apply(this, arguments);
        }
    });
});
