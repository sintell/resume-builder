define(['jquery', 'underscore', 'backbone', 'views/suggest'], function($, _, Backbone, Suggest) {
    'use strict';

    // Базовый класс для модулей, использующих логику работы со списком стран/городов.
    return Backbone.View.extend({
        const: {
            NO_RELOCATION: 'no_relocation',
            DELIMITER: ',',
            OTHER_COUNTRY: 1000,
            SUGGEST_MIN_INPUT: 2
        },

        _initializeSuggest: function() {
            var data = [];
            this._getDataForSuggest(this.area, data);

            this.suggest = new Suggest(data, {
                minInput: this.const.SUGGEST_MIN_INPUT
            });

            this.listenTo(this.suggest, 'selectSuggest', this.onSelectSuggest);
        },

        _orderArea: function(area) {
            var that = this;
            if (!area) {
                return;
            }

            area.areas = _.sortBy(area.areas, function(area) {
                var val = parseInt(area.id, 10);
                return val > that.const.OTHER_COUNTRY ? val: -val;
            });

            area.areas.forEach(function(area) {
                that._orderArea(area);
            });
        },

        _getDataForSuggest: function(node, result) {
            if (!node) {
                return null;
            }

            if (node.name && !node.areas.length) {
                result.push(node.name);
                return;
            }

            for (var i in node.areas) {
                this._getDataForSuggest(node.areas[i], result);
            }
        },

        _findIdByData: function(data, node) {
            var that = this,
                result;

            if (!node) {
                return null;
            }

            if (
                (data.id && node.id === data.id) ||
                (data.name && node.name && node.name.toLowerCase().replace('ё', 'е') === data.name.toLowerCase().replace('ё', 'е'))
            ) {
                return node;
            }

            node.areas.forEach(function(area) {
                if (result) {
                    return;
                }

                var found = that._findIdByData(data, area);

                if (found) {
                    result = found;
                }
            });

            return result;
        },

        _findNodeById: function(id, node) {
            return this._findIdByData({
                id: id
            }, node);
        },

        _findNodeByName: function(name, node) {
            return this._findIdByData({
                name: name
            }, node);
        }
    });
});
