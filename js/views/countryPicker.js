define(['jquery', 'underscore', 'backbone', 'views/baseArea'], function($, _, Backbone, BaseArea) {
    'use strict';

    return BaseArea.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-CountryPicker',

        componentName: 'country-picker',

        template: _.template($('#HH-ResumeBuilder-Component-CountryPicker').html()),

        events: {
            'change .HH-ResumeBuilder-Checkbox': '_select'
        },

        initialize: function(area, maxCount) {
            this.area = area;
            this.isShow = false;
            this.maxCount = maxCount;
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

            this._validateCount();

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

            selected = _.map(this.$el.find('.HH-ResumeBuilder-Checkbox:checked').parent().toArray(), function(item) {
                var name = $(item).text().trim();

                return _.find(that.area, function(item) {
                    return item.name === name;
                });
            });

            this._validateCount();

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

        _validateCount: function() {
            if (this.$el.find('.HH-ResumeBuilder-Checkbox:checked').length >= this.maxCount) {
                this.$el.find('.HH-ResumeBuilder-Checkbox:not(:checked)').attr('disabled', true);
            } else {
                this.$el.find('.HH-ResumeBuilder-Checkbox').removeAttr('disabled');
            }
        }
    });
});
