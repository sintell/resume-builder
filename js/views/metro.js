define(['jquery', 'underscore', 'backbone', 'models/metro', 'views/suggest'], function($, _, Backbone, MetroModel, Suggest) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'span',

        className: 'HH-ResumeSection-Component-Metro',

        componentName: 'metro',

        template: _.template($('#HH-ResumeBuilder-Component-Metro').html()),

        events: {

        },

        initialize: function(options) {
            this.model = new MetroModel();
            this.hasMetro = false;
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

            return this;
        },

        takeback: function(attributes) {
            if (!this.hasMetro) {
                attributes.metro = null;
                return;
            }

            this._updateValues();

            if (!this.metroId) {
                attributes.metro = null;
                return;
            }

            attributes.metro = {
                id: this.metroId
            };
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
                that.render();
            });
        },

        _updateValues: function() {
            this.metroName = $('.HH-ResumeBuilder-Component-Metro-Input').val();
            if (this.metroName) {
                this.metroId = this._getId();
            } else {
                this.metroId = 0;
            }
        },

        _getId: function() {
            var that = this,
                result = 0;

            _.each(this.model.attributes.lines, function(line){
                _.each(line.stations, function(station){
                    if (station.name.toLowerCase() === that.metroName.toLowerCase()){
                        result = station.id;
                    }
                });
            });

            return result;
        },

        _noMetro: function(){
            this.hasMetro = false;

            this.metroId = 0;
            this.metroName = null;
        }
    });
});
