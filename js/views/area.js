define(['jquery', 'underscore', 'backbone', 'views/suggest'], function($, _, Backbone, Suggest) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'span',

        className: 'HH-ResumeSection-Component-Area',

        componentName: 'area',

        template: _.template($('#HH-ResumeBuilder-Component-Area').html()),

        events: {
            'keyup .HH-ResumeBuilder-Component-Area-Input': '_updateSuggest'
        },

        initialize: function(options) {
            this.area = {
                areas: options.area.attributes
            };

            this._initializeSuggest();
        },

        fill: function(attributes) {
            this.id = parseInt(attributes.area.id);
            this.name = attributes.area.name;
        },

        render: function() {
            var data = $.extend({},{
                    area: {
                        id: this.id,
                        name: this.name
                    }
                });

            this.$el.html(this.template(data));

            return this;
        },

        onSelectSuggest: function(data) {
            this.$el.find('.HH-ResumeBuilder-Component-Area-Input').val(data.text);
            this._hideSuggest();
        },

        takeback: function(attributes) {
            this._updateValues();

            this.id = this._findNodeByName(this.name, this.area).id;

            attributes.area = {
                id: this.id
            };
        },

        _updateSuggest: function() {
            this._updateValues();

            this.suggest.updateSuggest(this.name);

            this.$el.find('.HH-ResumeBuilder-Component-Suggest').html(this.suggest.render().el);
            this.suggest.delegateEvents();
        },

        _hideSuggest: function(){
            this.$el.find('.HH-ResumeBuilder-Component-Suggest').empty();
        },

        _updateValues: function() {
            this.name = $('.HH-ResumeBuilder-Component-Area-Input').val();
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
        }
    });
});
