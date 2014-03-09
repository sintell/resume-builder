define(['jquery', 'underscore', 'backbone', 'views/suggest', 'views/areaModal'], function($, _, Backbone, Suggest, AreaModal) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'span',

        className: 'HH-ResumeSection-Component-Area',

        componentName: 'area',

        template: _.template($('#HH-ResumeBuilder-Component-Area').html()),

        const: {
            OTHER_COUNTRY: 1000,
            LOW_PRIORITY: 999999999
        },

        events: {
            'keyup .HH-ResumeBuilder-Component-Area-Input': '_updateSuggest',
            'keydown .HH-ResumeBuilder-Component-Area-Input': '_preventKeydown',
            'click .HH-ResumeBuilder-Component-Area-ShowModal': '_toggleModal',
            'change .HH-ResumeBuilder-Component-Area-Input': '_onChange'
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
            this.id = parseInt(attributes.area.id, 10);
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
            this._onChange();
        },

        onSelectModal: function(data) {
            this.$el.find('.HH-ResumeBuilder-Component-Area-Input').val(data.text);
            this.modal.hide();
            this._onChange();
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
            var that = this;
            if (!area) {
                return ;
            }

            area.areas = _.sortBy(area.areas, function(area) {
                var val = parseInt(area.id, 10);
                return val > that.const.OTHER_COUNTRY ? that.const.LOW_PRIORITY : -val;
            });

            for (var i in area.areas){
                this._orderArea(area.areas[i]);
            }
        },

        _updateSuggest: function(event) {
            this._updateValues();
            this.suggest.updateSuggest(this.name, this.width);
            this.suggest.processKey(event);
        },

        _updateValues: function() {
            var input = $('.HH-ResumeBuilder-Component-Area-Input');

            this.name = input.val();
            this.width = input.outerWidth();
        },

        _onChange: function(){
            this._updateValues();

            var node = this._findNodeByName(this.name, this.area);

            if (node) {
                this.id = node.id;
            } else {
                this.id = 0;
            }

            this.trigger('selectArea', this.id);
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
        },

        _preventKeydown: function(event) {
            this.suggest.preventKeydown(event);
        }
    });
});
