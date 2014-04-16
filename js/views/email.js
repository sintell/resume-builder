define([
    'jquery',
    'underscore',
    'backbone',
    'views/contact',
    'text!templates/email.html'
], function(
    $,
    _,
    Backbone,
    Contact,
    EmailTemplate
) {
    'use strict';

    return Contact.extend({
        template: _.template(EmailTemplate),

        fillContact: function(contact) {
            this.value = contact.value;
        },

        saveContact: function(contact) {
            contact.value = this.$('.HH-Contact-Value').val();
        },

        emptyValue: function() {
            return null;
        }
    });
});
