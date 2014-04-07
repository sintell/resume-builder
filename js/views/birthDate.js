define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'text!templates/birthDate.html'
], function($, _, Backbone, Utils, BirthDateTemplate) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-BirthDate',

        componentName: 'birth-date',

        template: _.template(BirthDateTemplate),

        events: {
            'change .HH-ResumeBuilder-Component-BirthDate-Month': '_change',
            'change .HH-ResumeBuilder-Component-BirthDate-Year': '_change'
        },

        fill: function(attributes) {
            var split = attributes.birth_date.split('-');

            this.day = parseInt(split[2], 10);
            this.month = parseInt(split[1], 10);
            this.year = parseInt(split[0], 10);

            this._updateCalendar();
        },

        render: function() {
            var data;

            data = {
                calendar: this.calendar,
                date: {
                    day: this.day,
                    month: this.month,
                    year: this.year
                }
            };

            this.$el.html(this.template(data));

            return this;
        },

        takeback: function(attributes) {
            attributes.birth_date = this._formatBirthDate();
        },

        _change: function() {
            this._updateValues();
            this._updateCalendar();
            this.render();
        },

        _updateValues: function() {
            this.day = parseInt(this.$('[name="birth_date-day"]').val(), 10);
            this.month = parseInt(this.$('[name="birth_date-month"]').val(), 10);
            this.year = parseInt(this.$('[name="birth_date-year"]').val(), 10);
        },

        _updateCalendar: function() {
            this.calendar = {
                months: Utils.getMonths(),
                days: this._daysInMonth()
            };
        },

        _daysInMonth: function() {
            var result = [],
                year = this.year;

            for (var i = 1; i < 13; i++) {
                result.push(new Date(year, i, 0).getDate());
            }

            return result;
        },

        _formatBirthDate: function() {
            var _addZero = function(val) {
                return val > 9 ? val : '0' + val;
            };

            this._updateValues();

            return this.year + '-' + _addZero(this.month) + '-' + _addZero(this.day);
        }
    });
});
