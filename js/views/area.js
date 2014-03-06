define(['jquery', 'underscore', 'backbone', 'views/suggest', 'views/areaModal'], function($, _, Backbone, Suggest, AreaModal) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'span',

        className: 'HH-ResumeSection-Component-Area',

        componentName: 'area',

        template: _.template($('#HH-ResumeBuilder-Component-Area').html()),

        events: {
            'keyup .HH-ResumeBuilder-Component-Area-Input': '_updateSuggest',
            'click .HH-ResumeBuilder-Component-Area-ShowModal': '_toggleModal'
        },

        initialize: function(options) {
            this.area = {
                areas: options.area.attributes
            };

            this._orderArea(this.area);

            this._initializeSuggest();
            this._initializeModal();
        },

        fill: function(attributes) {
            this.id = parseInt(attributes.area.id);
            this.name = attributes.area.name;
        },

        render: function() {
            var data;

            data = {
                area: {
                    id: this.id,
                    name: this.name
                }
            };

            this.$el.html(this.template(data));

            this.suggest.setElement(this.$el.find('.HH-ResumeBuilder-Component-Suggest'));
            this.modal.setElement(this.$el.find('.HH-ResumeBuilder-Component-AreaModal'));

            return this;
        },

        onSelectSuggest: function(data) {
            this.$el.find('.HH-ResumeBuilder-Component-Area-Input').val(data.text);
            this.suggest.hide();
        },

        onSelectModal: function(data) {
            this.$el.find('.HH-ResumeBuilder-Component-Area-Input').val(data.text);
            this.modal.hide();
        },

        takeback: function(attributes) {
            this._updateValues();

            var node = this._findNodeByName(this.name, this.area);

            if (node) {
                this.id = node.id;
            } else {
                this.id = 0;
            }

            attributes.area = {
                id: this.id
            };
        },

        _orderArea: function(area) {
            if (!area) {
                return ;
            }

            area.areas = _.sortBy(area.areas, function(area) {
                var val = parseInt(area.id);
                return val > 1000 ? 999999999 : -val;
            });

            for (var i in area.areas){
                this._orderArea(area.areas[i]);
            }
        },

        _updateSuggest: function() {
            this._updateValues();
            this.suggest.updateSuggest(this.name, this.width);
        },

        _updateValues: function() {
            var input;

            input = $('.HH-ResumeBuilder-Component-Area-Input');

            this.name = input.val();
            this.width = input.outerWidth() - parseInt(input.css('border-left-width'));
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
        },

        _initializeSuggest: function() {
            var data = [];
            this._getDataForSuggest(this.area, data);

            this.suggest = new Suggest(data, {
                minInput: 3
            });

            this.listenTo(this.suggest, 'selectSuggest', this.onSelectSuggest);
        },

        _getDataForSuggest: function(node, result) {
            if (!node){
                return null;
            }

            if (node.name && node.areas.length === 0) {
                result.push(node.name);
                return;
            }

            for (var i in node.areas){
                this._getDataForSuggest(node.areas[i], result);
            }
        },

        _initializeModal: function() {
            this.modal = new AreaModal(this.area);

            this.listenTo(this.modal, 'selectAreaModal', this.onSelectModal);
        },

        _toggleModal: function(event) {
            event.preventDefault();

            this._updateValues();
            this.modal.toggle(this.name);
        }
    });
});
