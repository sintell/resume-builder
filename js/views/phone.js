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
        const: {
            COUNTRY_START: 0,
            COUNTRY_END: 1,
            CITY_START: 1,
            CITY_END: 3,
            NUMBER_START: 4
        },

        fillContact: function(contact) {
            this.value = contact.value.country + contact.value.city + contact.value.number;
        },

        saveContact: function(contact) {
            var phone;

            phone = this.$('.HH-Contact-Value').val();
            contact.value = {
                country: phone.substr(this.const.COUNTRY_START, this.const.COUNTRY_END),
                city: phone.substr(this.const.CITY_START, this.const.CITY_END),
                number: phone.substr(this.const.NUMBER_START)
            };
        }
    });
});
