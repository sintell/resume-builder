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

        RUSSIA: 113,

        initialize: function(options) {
            this._setArea({
                areas: options.area.attributes
            });

            this._initializeCountryPicker();
        },

        fill: function(attributes) {
            this.selectedAreas = _.map(attributes.citizenship, function(item) {
                return { id:  parseInt(item.id) };
            });
        },

        render: function() {
            var data;

            data = {
                area: this.area,
                RUSSIA: this.RUSSIA,
                selectedAreas: this.selectedAreas
            };

            this.$el.html(this.template(data));

            this.countryPicker.setSelectedAreas(this.selectedAreas);

            this.countryPicker.setElement(this.$el.find('.HH-ResumeBuilder-Component-CountryPicker'));

            if (this.selectedAreas.length !== 1 || this.selectedAreas[0].id !== this.RUSSIA) {
                this.countryPicker.show();
            }

            return this;
        },

        takeback: function(attributes) {
            attributes.citizenship = this.selectedAreas;
        },

        _setArea: function(area) {
            var OTHER_COUNTRIES = 1001,
                that = this,
                pointer = area;

            this.area = [];

            for (var j = 0; j < 2; j++) {
                for (var i in pointer.areas) {
                    if (parseInt(pointer.areas[i].id) !== OTHER_COUNTRIES) {
                        this.area.push({
                            id: parseInt(pointer.areas[i].id),
                            name:pointer.areas[i].name
                        });
                    } else {
                        pointer = pointer.areas[i];
                    }
                }
            }

            this.area = _.sortBy(this.area, function(area) {
                return area.name;
            });

            var russia = _.find(this.area, function(item) {
                return item.id === that.RUSSIA;
            });

            if (this.area.length !== 0 ){
                this.area.splice(this.area.indexOf(russia), 1);
                this.area.unshift(russia);
            }
        },

        _initializeCountryPicker: function() {
            this.countryPicker = new CountryPicker(this.area);

            this.listenTo(this.countryPicker, 'countryPicked', this._onCountryPicked);
        },

        _onCountryPicked: function(selectedAreas) {
            this.selectedAreas = selectedAreas;
        },

        _change: function(event) {
            if ($(event.currentTarget).is('.HH-ResumeBuilder-Component-Citizenship-Russia')) {
                this.selectedAreas = [
                    {
                        id: this.RUSSIA
                    }
                ];
            }

            this.countryPicker.toggle();
        }
    });
});
