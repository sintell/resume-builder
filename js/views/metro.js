define(['jquery', 'underscore', 'backbone', 'models/metro', 'views/suggest'], function($, _, Backbone, MetroModel, Suggest) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'span',

        className: 'HH-ResumeSection-Component-Metro',

        componentName: 'metro',

        template: _.template($('#HH-ResumeBuilder-Component-Metro').html()),

        events: {
            'keyup .HH-ResumeBuilder-Component-Metro-Input': '_updateSuggest',
            'keydown .HH-ResumeBuilder-Component-Metro-Input': '_preventKeydown'
        },

        initialize: function(options) {
            this.model = new MetroModel();
            this.hasMetro = false;

            this._initializeSuggest();
        },

        fill: function(attributes) {
            var that = this;

            that.metroName = (attributes.metro || {})['name'];
            that.metroId = (attributes.metro || {})['id'];

            if (attributes.area && attributes.area.id) {
                that._fetchMetroModel(attributes.area.id);
            } else {
                that.render();
            }
        },

        render: function() {
            var data = {
                hasMetro: this.hasMetro,
                metro: this.metroName
            };

            this.$el.html(this.template(data));

            this.suggest.setElement(this.$el.find('.HH-ResumeBuilder-Component-Suggest'));

            return this;
        },

        takeback: function(attributes) {
            if (!this.hasMetro) {
                attributes.metro = null;
                return;
            }

            this._updateValues();

            if (this.metroName) {
                this.metroId = this._getId();
            } else {
                this.metroId = 0;
            }

            if (!this.metroId) {
                attributes.metro = null;
                return;
            }

            attributes.metro = {
                id: this.metroId
            };
        },

        onSelectSuggest: function(data) {
            this.$el.find('.HH-ResumeBuilder-Component-Metro-Input').val(data.text);
            this.suggest.hide();
        },

        _onSelectArea: function(id){
            var that = this;
            if (!id) {
                that._noMetro();
                that.render();
            } else {
                this._fetchMetroModel(id);
            }
        },

        _fetchMetroModel: function(id) {
            var that = this;

            this.model.setCity(id);

            $.when(this.model.fetch({
                error: function(model, xhr, options) {
                    // нет метро у этого города
                    that._noMetro();
                    that.render();
                }
            })).then(function(){
                that.hasMetro = true;
                that.suggestData = that._getDataForSuggest();

                /// Проверка, есть у эта станция на двух линиях
                /// Если есть, то в списке саджсеста она будет с припиской линии
                if (that.metroName && that.suggestData.indexOf(that.metroName) === -1) {
                    /// Находим по idшнику линию и приписываем к себе
                    var name = that._getLineNameByStationId();

                    that.metroName += ' (' + name + ')';
                }

                that.suggest.setData(that.suggestData);
                that.render();
            });
        },

        _updateValues: function() {
            var input = $('.HH-ResumeBuilder-Component-Metro-Input');
            this.metroName = input.val();
            this.width = input.outerWidth();
        },

        _updateSuggest: function(event) {
            this._updateValues();
            this.suggest.updateSuggest(this.metroName, this.width);
            this.suggest.processKey(event);
        },

        _getId: function() {
            var that = this,
                result = 0,
                regexp = /(.*) \((.*)\)/;

            var matches = regexp.exec(that.metroName);

            if (matches) {
                that.metroName = matches[1];
                that.lineName = matches[2];
            }

            _.each(this.model.attributes.lines, function(line){
                if (that.lineName) {
                    if (line.name.toLowerCase() !== that.lineName.toLowerCase()) {
                        return;
                    }
                }

                _.each(line.stations, function(station){
                    if (station.name.toLowerCase() === that.metroName.toLowerCase()){
                        result = station.id;
                    }
                });
            });

            return result;
        },


        _getLineNameByStationId: function() {
            var that = this;

            var line = _.find(this.model.attributes.lines, function(line){
                return _.find(line.stations, function(station) {
                    return station.id === that.metroId;
                });
            });

            if (line) {
                return line.name;
            }

            return '';
        },

        _noMetro: function() {
            this.hasMetro = false;

            this.metroId = 0;
            this.metroName = null;
        },

        _initializeSuggest: function() {
            this.suggest = new Suggest([], {
                minInput: 3
            });

            this.listenTo(this.suggest, 'selectSuggest', this.onSelectSuggest);
        },

        _getDataForSuggest: function() {
            var data = [];

            var multipleStations = [];

            _.each(this.model.attributes.lines, function(line){
                _.each(line.stations, function(station){

                    if (data.indexOf(station.name) >= 0) {
                        multipleStations.push(station.name);
                    }

                    data.push(station.name);
                });
            });

            if (multipleStations.length !== 0) {
                data = _.difference(data, multipleStations);

                _.each(this.model.attributes.lines, function(line){
                    _.each(line.stations, function(station){
                        if (multipleStations.indexOf(station.name) >= 0) {
                            data.push(station.name + ' (' + line.name +  ')');
                        }
                    });
                });
            }

            return data;
        },

        _preventKeydown: function(event) {
            this.suggest.preventKeydown(event);
        }
    });
});
