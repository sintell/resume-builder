define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-CountryPicker',

        componentName: 'country-picker',

        template: _.template($('#HH-ResumeBuilder-Component-CountryPicker').html()),

        events: {
            'change input[type="checkbox"]': '_select'
        },

        initialize: function(area) {
            this.area = area;
            this.isShow = false;
        },

        setSelectedAreas: function(selectedAreas) {
            this.selectedAreas =  selectedAreas;

            this.selectedIds = _.map(selectedAreas, function(item) {
                return item.id;
            });
        },

        render: function() {
            var data;

            data = {
                area: this.area,
                selectedIds: this.selectedIds
            };

            this.$el.html(this.template(data));

            return this;
        },

        toggle: function() {
            if (!this.isShow) {
                this.show();
            } else {
                this.hide();
            }
        },

        show: function() {
            this.render();
            this.isShow = true;
        },

        hide: function() {
            this.$el.empty();
            this.isShow = false;
        },

        _select: function(event) {
            event.stopPropagation();

            var selected,
                that = this;

            selected = _.map(this.$el.find(':checked').parent().toArray(), function(item) {
                var name = $(item).text().trim();

                return _.find(that.area, function(item) {
                    return item.name === name;
                });
            });

            this.trigger('countryPicked', selected);
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
            if (!node) {
                return null;
            }

            if (node.id === id) {
                return node;
            }

            for (var i in node.areas) {
                var found = this._findNodeById(id, node.areas[i]);
                if (found) {
                    return found;
                }
            }

            return null;
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
        }
    });
});
