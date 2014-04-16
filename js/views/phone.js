define([
    'jquery',
    'underscore',
    'backbone',
    'views/contact',
    'text!templates/phone.html'
], function(
    $,
    _,
    Backbone,
    Contact,
    PhoneTemplate
) {
    'use strict';

    return Contact.extend({
        template: _.template(PhoneTemplate),

        fillContact: function(contact) {
            this.value = {
                country: contact.value.country,
                city: contact.value.city,
                number: contact.value.number
            };
        },

        saveContact: function(contact) {
            contact.value = {
                country: this._filterNumbers(this.$('.HH-Phone-Country').val()),
                city: this._filterNumbers( this.$('.HH-Phone-City').val()),
                number: this._filterNumbers(this.$('.HH-Phone-Number').val())
            };
        },

        emptyValue: function() {
            return {
                country: null,
                city: null,
                number: null
            };
        },

        _filterNumbers: function(str) {
            return str.match(/\d+/g).join('');
        }
    });
});
