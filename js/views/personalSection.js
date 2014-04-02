define([
    'jquery',
    'underscore',
    'backbone',
    'views/resumeSection',
    'views/area',
    'views/birthDate',
    'views/metro',
    'views/resumeCountryPicker',
    'text!/templates/personalSection.html',
    'text!templates/citizenship.html',
    'text!templates/workTicket.html'
], function(
    $,
    _,
    Backbone,
    ResumeSection,
    AreaView,
    BirthDateView,
    MetroView,
    ResumeCountryPicker,
    PersonalSectionTemplate,
    CitizenshipTemplate,
    WorkTicketTemplate
) {
    'use strict';

    return ResumeSection.extend({
        namespace: 'personal_info',

        template: _.template(PersonalSectionTemplate),

        initialize: function(options) {
            var citizenshipOptions,
                workTicketOptions;

            ResumeSection.prototype.initialize.apply(this, [options]);

            $.extend(options, {resume: this.model});
            citizenshipOptions = $.extend({}, options, {template: CitizenshipTemplate});
            workTicketOptions = $.extend({}, options, {template: WorkTicketTemplate});

            this.components.push(new BirthDateView());
            this.components.push(new AreaView(options));
            this.components.push(new ResumeCountryPicker(citizenshipOptions, {
                name: 'citizenship',
                templateName: 'Citizenship',
                componentName: 'citizenship'
            }));
            this.components.push(new ResumeCountryPicker(workTicketOptions, {
                name: 'work_ticket',
                templateName: 'WorkTicket',
                componentName: 'work-ticket'
            }));
            this.components.push(new MetroView());
        },

        render: function(data) {
            return ResumeSection.prototype.render.apply(this, arguments);
        }
    });
});
