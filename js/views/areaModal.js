define([
    'jquery',
    'underscore',
    'backbone',
    'views/baseArea',
    'text!templates/areaModal.html'
], function($, _, Backbone, BaseArea, AreaModalTemplate) {
    'use strict';

    // Модуль, отвечающий за отображение стран/городов в виде вложенного списка.
    // Применяется для заполнения города проживания (area.js)
    return BaseArea.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-AreaModal',

        componentName: 'area-modal',

        template: _.template(AreaModalTemplate),

        events: {
            'click .HH-Component-AreaModal-Item': '_selectOrOpen'
        },

        initialize: function(area) {
            this.area = area;

            this._initArea(this.area, false);

            this.modalShow = false;
        },

        _initArea: function(area, val) {
            if (!area) {
                return;
            }

            area.open = val;

            for (var i in area.areas) {
                this._initArea(area.areas[i]);
            }
        },

        render: function() {
            var data;

            data = {
                area: this.area,
                fntemplate: this.template
            };

            this.$el.html(this.template(data));

            return this;
        },

        toggle: function(name) {
            if (!this.modalShow) {
                this.show(name);
            } else {
                this.hide();
            }
        },

        show: function(activeName) {
            var node = this._findNodeByName(activeName, this.area);

            this._setNodeAndParentsOpen(node);

            this.render();
            this.modalShow = true;
        },

        hide: function() {
            this._initArea(this.area, false);

            this.$el.empty();
            this.modalShow = false;
        },

        _selectOrOpen: function(event) {
            event.stopPropagation();

            // Без .first() jquery выбирает все элементы .HH-AreaModal-Text,
            // в том числе и у раскрытых child в иерархии.
            var text = $(event.currentTarget).find('.HH-AreaModal-Text').first().text();
            var node = this._findNodeByName(text, this.area);

            if (node.areas.length === 0) {
                this.trigger('selectAreaModal', {
                    text: node.name
                });
            } else {
                node.open = !node.open;
                this.render();
            }
        },

        _setNodeAndParentsOpen: function(node) {
            if (!node) {
                return;
            }

            node.open = true;

            if (node.parent_id) {
                this._setNodeAndParentsOpen(this._findNodeById(node.parent_id, this.area));
            }
        }
    });
});
