define([
    'jquery',
    'underscore',
    'backbone',
    'views/contact'
], function(
    $,
    _,
    Backbone,
    Contact
    ) {
    'use strict';

    return Contact.extend({
        fillContact: function(contact) {
            this.value = contact.value;
        },

        saveContact: function(contact) {
            contact.value = this.$('.HH-Contact-Value').val();
        }
    });
});
