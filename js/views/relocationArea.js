define([
    'jquery',
    'underscore',
    'backbone',
    'views/baseArea',
    'views/suggest',
    'views/tags',
    'utils',
    'text!templates/relocationArea.html'
], function(
    $,
    _,
    Backbone,
    BaseArea,
    Suggest,
    Tags,
    Utils,
    RelocationAreaTemplate
) {
    'use strict';

    // Модуль, отвечающий за отображение и логику заполнения "городов переезда"
    return BaseArea.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-RelocationArea',

        componentName: 'relocation-area',

        template: _.template(RelocationAreaTemplate),

        events: {
            'keyup .HH-ResumeBuilder-Component-RelocationArea-Input': '_updateSuggest',
            'keydown .HH-ResumeBuilder-Component-RelocationArea-Input': '_preventKeydown',
            'focusout .HH-ResumeBuilder-Component-RelocationArea-Input': '_onFocusOut',
            'click .HH-ResumeBuilder-Component-RelocationArea-Add': '_addTags'
        },

        initialize: function(options) {
            this.area = {
                areas: options.area.attributes
            };

            this._orderArea(this.area);

            this._initializeSuggest();
            this.tags = new Tags();
        },

        fill: function(attributes) {
            var that = this;

            this.needArea = attributes.relocation.type.id !== this.const.NO_RELOCATION;

            if (!attributes.relocation.area) {
                return;
            }

            this.areas = _.map(attributes.relocation.area, function(area) {
                return area.name;
            }).join(', ');

            attributes.relocation.area.forEach(function(item) {
                that.tags.addTag(item.name, item, true);
            });
        },

        render: function() {
            var data = {
                areas: this.areas,
                needArea: this.needArea
            };

            this.$el.html(this.template(data));

            this.suggest.setElement(this.$('.HH-ResumeBuilder-Component-Suggest'));
            this.tags.setElement(this.$('.HH-ResumeBuilder-Component-Tags'));

            this.tags.render();

            this.$input = this.$('.HH-ResumeBuilder-Component-RelocationArea-Input');

            return this;
        },

        takeback: function(attributes) {
            if (!this.needArea) {
                return;
            }

            this._updateValues();

            attributes.relocation = attributes.relocation || {};
            attributes.relocation.area = this.tags.takeback().map(function(item) {
                return item.data;
            });
        },

        onSelectSuggest: function(data) {
            if (this.inputAreas.indexOf(this.const.DELIMITER) > 0) {
                var areas = this._getSplittedAreas();

                if (areas.length) {
                    areas[areas.length - 1] = data.text;
                }

                this.$input.val(areas.join(this.const.DELIMITER + ' '));
            } else {
                this.$input.val('');

                var node = this._findNodeByName(data.text, this.area);

                if (!node) {
                    return;
                }

                this.tags.addTag(data.text, {id: node.id}, false)
            }

            this.suggest.hide();
            this.$input.focus();
        },

        _addTags: function() {
            var that = this;

            this._updateValues();

            this._getSplittedAreas()
                .forEach(function(item) {
                    if (!item) {
                        return;
                    }

                    var node = that._findNodeByName(item, that.area);

                    if (!node) {
                        return;
                    }

                    that.tags.addTag(item, {id: node.id}, false);
                });

            this.$input.val('');
            this.tags.render();
        },

        _updateValues: function() {
            if (!this.needArea) {
                return;
            }

            this.inputAreas = this.$input.val();
            this.width = this.$input.outerWidth();
        },

        _updateSuggest: function(event) {
            this._updateValues();

            if (
                event.keyCode === Utils.keycodes.ENTER &&
                this.suggest.getSelected() === null
            ) {
                this._addTags();
                this.suggest.hide();
                return;
            }

            var areas = this._getSplittedAreas();

            this.suggest.update(areas[areas.length - 1], this.width);
            this.suggest.processKey(event);
        },

        _onSelectRelocation: function(id) {
            if (this.needArea != (id !== this.const.NO_RELOCATION)) {
                this.needArea = id !== this.const.NO_RELOCATION;
                this.render();
            }
        },

        _getSplittedAreas: function() {
            return this.inputAreas
                .split(this.const.DELIMITER)
                .map(function(item) {
                    return item.trim();
                });
        },

        _onFocusOut: function(event) {
            this.suggest.hide();
        }
    });
});
