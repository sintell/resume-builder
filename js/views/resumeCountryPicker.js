define([
    'jquery',
    'underscore',
    'backbone',
    'views/baseArea',
    'views/tags',
    'views/suggest',
    'utils'
], function(
    $,
    _,
    Backbone,
    BaseArea,
    Tags,
    Suggest,
    Utils
) {
    'use strict';

    return Backbone.View.extend({
        className: function() {
            return 'HH-ResumeSection-Component-' + this.templateName;
        },

        events: function() {
            var e = {};

            e['keyup .HH-' + this.templateName + '-Input'] = '_updateSuggest';
            e['keydown .HH-' + this.templateName + '-Input'] = '_preventKeydown';
            e['click .HH-' + this.templateName + '-Add'] = '_addTags';

            return e;
        },

        const: {
            RUSSIA: 113,
            OTHER_COUNTRIES: 1001,
            DELIMITER: ','
        },

        initialize: function(options, names) {
            // Суть в том, что блоки "гражданство" и "разрешение на работу" одинаковые.
            // Единственное отличие - название поля, откуда брать данные из резюме и т.д.
            // Именно это название мы передаём в initialize
            this.name = names.name;
            this.componentName = names.componentName;
            this.templateName = names.templateName;

            this.template = _.template(options.template);

            this._initializeContries({
                areas: options.area.attributes
            });

            this.maxCount = options.resume.conditions.get(this.name).max_count;

            this._initializeTags();
            this._initializeSuggest();
        },

        fill: function(attributes) {
            var that = this;

            attributes[this.name].map(function(item) {
                var data = {
                    id:  parseInt(item.id, 10),
                    name: item.name
                };

                that.tags.addTag(data.name, data, false);
            });
        },

        render: function() {
            this.$el.html(this.template());

            this.suggest.setElement(this.$('.HH-ResumeBuilder-Component-Suggest'));
            this.tags.setElement(this.$('.HH-ResumeBuilder-Component-Tags'));

            this.tags.render();

            this.$input = this.$('.HH-'+ this.templateName + '-Input');
            this.$add = this.$('.HH-'+ this.templateName + '-Add');

            this.toggleInput();

            return this;
        },

        takeback: function(attributes) {
            attributes[this.name] = this.tags.takeback().map(function(item) {
                return item.data;
            });
        },

        toggleInput: function() {
            if (this.tags.getCount() >= this.maxCount) {
                this.$input.hide();
                this.$add.hide();
            } else {
                this.$input.show();
                this.$add.show();
            }
        },

        _addTags: function() {
            var that = this;

            this._updateValues();

            this.inputAreas
                .split(this.const.DELIMITER)
                .map($.trim)
                .forEach(function(item) {
                    if (that.tags.getCount() >= that.maxCount) {
                        return;
                    }

                    if (!item) {
                        return;
                    }

                    var node = that._findNodeByName(item);

                    if (!node) {
                        return;
                    }

                    that.tags.addTag(item, {id: node.id}, false);
                });

            this.$input.val('');
            this.tags.render();
            this.toggleInput();
        },

        _initializeContries: function(areas) {
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
        },

        onRemoveTag: function() {
            this.toggleInput();
        },

        onSelectSuggest: function(data) {
            this._updateValues();

            if (this.inputAreas.indexOf(this.const.DELIMITER) > 0) {
                var areas = this.inputAreas.split(this.const.DELIMITER).map($.trim);

                if (areas.length) {
                    areas[areas.length - 1] = data.text;
                }

                this.$input.val(areas.join(this.const.DELIMITER + ' '));
            } else {
                this.$input.val('');

                var node = this._findNodeByName(data.text);

                if (!node) {
                    return;
                }

                this.tags.addTag(data.text, node);
            }


            this.suggest.hide();
            this.$input.focus();
            this.toggleInput();
        },

        _updateValues: function() {
            this.inputAreas = this.$input.val();
            this.width =this.$input.outerWidth();
        },

        _updateSuggest: function(event) {
            var that = this;

            this._updateValues();

            if (
                event.keyCode === Utils.keycodes.ENTER &&
                this.suggest.getSelected() === null
                ) {
                this._addTags();
                this.suggest.hide();
                return;
            }

            var areas = this.inputAreas
                .split(this.const.DELIMITER)
                .map($.trim);

            var lastArea = areas[areas.length - 1];

            this.suggest.update(lastArea, this.width);

            this.suggest.processKey(event);
        },

        _preventKeydown: function(event) {
            this.suggest.preventKeydown(event);
        },

        _initializeSuggest: function() {
            var names = this.area.map(function(item) {
                return item.name;
            });

            this.suggest = new Suggest();
            this.listenTo(this.suggest, 'selectSuggest', this.onSelectSuggest);
            this.suggest.setData(names);
        },

        _initializeTags: function() {
            this.tags = new Tags();
            this.listenTo(this.tags, 'remove', this.onRemoveTag);
        },

        _findNodeByName: function(name) {
            return _.find(this.area, function(item) {
                return item.name === name;
            });
        }
    });
});
