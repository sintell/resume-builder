define([
    'jquery',
    'underscore',
    'backbone',
    'views/resumeSection',
    'views/accessType',
    'views/accessTypeCompanyList',
    'text!templates/accessSection.html'
], function(
    $,
    _,
    Backbone,
    ResumeSection,
    AccessTypeView,
    AccessTypeCompanyListModal,
    AccessSectionTemplate
) {
    'use strict';

    return ResumeSection.extend({
        className: 'HH-Resume-ResumeSection',

        namespace: 'access',

        template: _.template(AccessSectionTemplate),

        initialize: function(options) {
            var modal;

            ResumeSection.prototype.initialize.apply(this, [options]);

            $.extend(options, {resume: this.model});

            modal = new AccessTypeCompanyListModal();
            this.components.push(modal);
            this.components.push(new AccessTypeView(options, modal));
        },

        render: function() {
            return ResumeSection.prototype.render.apply(this, arguments);
        }
    });
});
