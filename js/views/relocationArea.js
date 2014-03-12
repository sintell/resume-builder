define(['jquery', 'underscore', 'backbone', 'views/suggest'], function($, _, Backbone, Suggest) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        const: {
            NO_RELOCATION: 'no_relocation',
            DELIMITER: ',',
            OTHER_COUNTRY: 1000,
            LOW_PRIORITY: 999999999
        },

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

        _findNodeByName: function(name, node) {
            if (!node) {
                return null;
            }

            if (node.name && node.name.toLowerCase() === name.toLowerCase()) {
                return node;
            }

            for (var i in node.areas) {
                var found = this._findNodeByName(name, node.areas[i]);
                if (found) {
                    return found;
                }
            }

            return null;
        },

        _orderArea: function(area) {
            var that = this;
            if (!area) {
                return ;
            }

            area.areas = _.sortBy(area.areas, function(area) {
                var val = parseInt(area.id, 10);
                return val > that.const.OTHER_COUNTRY ? that.const.LOW_PRIORITY : -val;
            });

            for (var i in area.areas) {
                this._orderArea(area.areas[i]);
            }
        },

        _onSelectRelocation: function(id) {
            if (this.needArea != (id !== this.const.NO_RELOCATION)) {
                this.needArea = id !== this.const.NO_RELOCATION;
                this.render();
            }
        },

        _getDataForSuggest: function(node, result) {
            if (!node) {
                return null;
            }

            if (node.name && node.areas.length === 0) {
                result.push(node.name);
                return;
            }

            for (var i in node.areas) {
                this._getDataForSuggest(node.areas[i], result);
            }
        },

        _initializeSuggest: function() {
            var data = [];
            this._getDataForSuggest(this.area, data);

            this.suggest = new Suggest(data, {
                minInput: 3
            });

            this.listenTo(this.suggest, 'selectSuggest', this.onSelectSuggest);
        },
    });
});
