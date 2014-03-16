define(['jquery', 'underscore', 'backbone', 'views/countryPicker'], function($, _, Backbone, CountryPicker) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'span',

        className: 'HH-ResumeSection-Component-Citizenship',

        componentName: 'citizenship',

        template: _.template($('#HH-ResumeBuilder-Component-Citizenship').html()),

        events: {
            'change .HH-ResumeBuilder-Component-Citizenship-Other': '_change',
            'change .HH-ResumeBuilder-Component-Citizenship-Russia': '_change'
        },

        const: {
            RUSSIA: 113,
            OTHER_COUNTRIES: 1001
        },

        initialize: function(options) {
            this._setArea({
                areas: options.area.attributes
            });

            if (options.resume.ready) {
                this.maxCount = options.resume.conditions.get('citizenship').max_count;
            }

            this._initializeCountryPicker();
        },

        fill: function(attributes) {
            this.selectedAreas = _.map(attributes.citizenship, function(item) {
                return { id:  parseInt(item.id, 10) };
            });
        },

        render: function() {
            var data;

            data = {
                area: this.area,
                RUSSIA: this.const.RUSSIA,
                selectedAreas: this.selectedAreas
            };

            this.$el.html(this.template(data));

            this.countryPicker.setSelectedAreas(this.selectedAreas);

            this.countryPicker.setElement(this.$el.find('.HH-ResumeBuilder-Component-CountryPicker'));

            if (this.selectedAreas.length !== 1 || this.selectedAreas[0].id !== this.const.RUSSIA) {
                this.countryPicker.show();
            }

            return this;
        },

        takeback: function(attributes) {
            attributes.citizenship = this.selectedAreas;
        },

        _setArea: function(areas) {
            var that = this;
            var otherCountries;

            that.area = [];


            // Выбираем все страны наверху списка
            _.each(areas.areas, function(area) {
                if (parseInt(area.id, 10) !== that.const.OTHER_COUNTRIES) {
                    that.area.push({
                        id: parseInt(area.id, 10),
                        name: area.name
                    });
                } else {
                    otherCountries = area;
                }
            });

            // Выбираем страны в ветви других стран
            if (otherCountries) {
                _.each(otherCountries.areas, function(area) {
                    that.area.push({
                        id: parseInt(area.id, 10),
                        name: area.name
                    });
                });
            }

            var russia;
            that.area = _.sortBy(that.area, function(area) {
                if (area.id === that.const.RUSSIA) {
                    russia = area;
                }
                return area.name;
            });

            if (that.area.length) {
                that.area.splice(this.area.indexOf(russia), 1);
                that.area.unshift(russia);
            }
        },

        _initializeCountryPicker: function() {
            this.countryPicker = new CountryPicker(this.area, this.maxCount);

            this.listenTo(this.countryPicker, 'countryPicked', this._onCountryPicked);
        },

        _onCountryPicked: function(selectedAreas) {
            this.selectedAreas = selectedAreas;
        },

        _change: function(event) {
            if ($(event.currentTarget).is('.HH-ResumeBuilder-Component-Citizenship-Russia')) {
                this.selectedAreas = [
                    {
                        id: this.const.RUSSIA
                    }
                ];
            }

            this.countryPicker.toggle();
        }
    });
});
