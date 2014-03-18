define(['jquery', 'underscore', 'backbone', 'views/countryPicker'], function($, _, Backbone, CountryPicker) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        className: function() {
            return 'HH-ResumeSection-Component-' + this.templateName;
        },

        events: function() {
            var e = {};

            e['change .HH-ResumeBuilder-Component-' + this.templateName + '-Other'] = '_change';
            e['change .HH-ResumeBuilder-Component-' + this.templateName + '-Russia'] = '_change';

            return e;
        },

        const: {
            RUSSIA: 113,
            OTHER_COUNTRIES: 1001
        },

        initialize: function(options, names) {
            // Суть в том, что блоки "гражданство" и "разрешение на работу" одинаковые.
            // Единственное отличие - название поля, откуда брать данные из резюме и т.д.
            // Именно это название мы передаём в initialize
            this.name = names.name;
            this.componentName = names.componentName;
            this.templateName = names.templateName;

            this.template = _.template(options.template);

            this._setArea({
                areas: options.area.attributes
            });

            if (options.resume.ready) {
                this.maxCount = options.resume.conditions.get(this.name).max_count;
            }

            this._initializeCountryPicker();
        },

        fill: function(attributes) {
            this.selectedAreas = _.map(attributes[this.name], function(item) {
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
            attributes[this.name] = this.selectedAreas;
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

            that.area = _.sortBy(that.area, function(area) {
                if (area.id === that.const.RUSSIA) {
                    // Выводим Россию на первую позицию в списке
                    return '';
                }



                return area.name;
            });
        },

        _initializeCountryPicker: function() {
            this.countryPicker = new CountryPicker(this.area, this.maxCount);

            this.listenTo(this.countryPicker, 'countryPicked', this._onCountryPicked);
        },

        _onCountryPicked: function(selectedAreas) {
            this.selectedAreas = selectedAreas;
        },

        _change: function(event) {
            if ($(event.currentTarget).is('.HH-ResumeBuilder-Component-' + this.templateName +'-Russia')) {
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
