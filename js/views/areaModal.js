define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-AreaModal',

        componentName: 'area-modal',

        template: _.template($('#HH-ResumeBuilder-Component-AreaModal').html()),

        events: {
            'click li': '_selectOrOpen'
        },

        initialize: function(area, initialArea) {
            this.area = area;

            this._initArea(this.area, false);

            this.modalShow = false;
        },

        _initArea: function(area, val) {
            if (area == null){
                return;
            }

            area.open = val;

            for (var i in area.areas){
                this._initArea(area.areas[i]);
            }
        },

        render: function() {
            var data = $.extend({},{
                    area: this.area
                }, {
                    fntemplate: this.template
                });

            this.$el.html(this.template(data));

            return this;
        },

        toggle: function(name) {
            if (!this.modalShow){
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

        hide: function(){
            this._initArea(this.area, false);

            this.$el.empty();
            this.modalShow = false;
        },

        _selectOrOpen: function(event){
            event.stopPropagation();

            var text = $(event.currentTarget).children().first().text();
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
        },

        _findNodeById: function(id, node) {
            if (!node){
                return null;
            }

            if (node.id === id){
                return node;
            }

            for (var i in node.areas){
                var found = this._findNodeById(id, node.areas[i]);
                if (found) {
                    return found;
                }
            }

            return null;
        },

        _findNodeByName: function(name, node) {
            if (!node){
                return null;
            }

            if (node.name && node.name.toLowerCase() === name.toLowerCase()) {
                return node;
            }

            for (var i in node.areas){
                var found = this._findNodeByName(name, node.areas[i]);
                if (found) {
                    return found;
                }
            }

            return null;
        }
    });
});
