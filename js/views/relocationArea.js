define(['jquery', 'underscore', 'backbone', 'views/baseArea', 'views/suggest'], function($, _, Backbone, BaseArea, Suggest) {
    'use strict';

    // Модуль, отвечающий за отображение и логику заполнения "городов переезда"
    return BaseArea.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-RelocationArea',

        componentName: 'relocation-area',

        template: _.template($('#HH-ResumeBuilder-Component-RelocationArea').html()),

        events: {
            'keyup .HH-ResumeBuilder-Component-RelocationArea-Input': '_updateSuggest',
            'keydown .HH-ResumeBuilder-Component-RelocationArea-Input': '_preventKeydown',
        },

        initialize: function(options) {
            this.area = {
                areas: options.area.attributes
            };

            this._orderArea(this.area);

            this._initializeSuggest();
        },

        fill: function(attributes) {
            this.needArea = attributes.relocation.type.id !== this.const.NO_RELOCATION;

            this.areas = _.map(attributes.relocation.area, function(area) {
                return area.name;
            }).join(', ');
        },

        render: function() {
            var data;

            data = {
                areas: this.areas,
                needArea: this.needArea
            };

            this.$el.html(this.template(data));

            this.suggest.setElement(this.$el.find('.HH-ResumeBuilder-Component-Suggest'));

            return this;
        },

        takeback: function(attributes) {
            if (!this.needArea) {
                return;
            }

            this._updateValues();
            var areas = this._getAreas();

            attributes.relocation = attributes.relocation || {};
            attributes.relocation.area = this._getAreas();
        },

        onSelectSuggest: function(data) {
            var split = this.inputAreas.split(this.const.DELIMITER);

            var areas =  _.map(split, function(item) {
                return $.trim(item);
            });

            if (areas.length) {
                areas[areas.length - 1] = data.text;
            }

            this.$el.find('.HH-ResumeBuilder-Component-RelocationArea-Input').val(
                areas.join(this.const.DELIMITER + ' ')
            );

            this.suggest.hide();

            this.$el.find('.HH-ResumeBuilder-Component-RelocationArea-Input').focus();
        },

        _getAreas: function() {
            var split = this.inputAreas.split(this.const.DELIMITER),
                that = this;

            return _.map(split, function(item) {
                return  {
                    id: that._findNodeByName($.trim(item), that.area).id
                };
            });
        },

        _updateValues: function() {
            if (!this.needArea) {
                return;
            }

            var input = this.$el.find('input');

            this.inputAreas = input.val();
            this.width = input.outerWidth();
        },

        _updateSuggest: function(event) {
            this._updateValues();

            var split = this.inputAreas.split(this.const.DELIMITER);

            var areas =  _.map(split, function(item) {
                return $.trim(item);
            });

            this.suggest.updateSuggest(_.last(areas), this.width);
            this.suggest.processKey(event);
        },

        _onSelectRelocation: function(id) {
            if (this.needArea != (id !== this.const.NO_RELOCATION)) {
                this.needArea = id !== this.const.NO_RELOCATION;
                this.render();
            }
        }
    });
});
