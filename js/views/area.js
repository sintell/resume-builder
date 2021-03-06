define([
    'jquery',
    'underscore',
    'backbone',
    'views/baseArea',
    'views/suggest',
    'text!templates/area.html'
], function(
    $,
    _,
    Backbone,
    BaseArea,
    Suggest,
    AreaTemplate
) {
    'use strict';

    // Модуль, отвечающий за город проживания.
    return BaseArea.extend({
        tagName: 'span',

        className: 'HH-ResumeSection-Component-Area',

        componentName: 'area',

        template: _.template(AreaTemplate),

        events: {
            'keyup .HH-ResumeBuilder-Component-Area-Input': '_updateSuggest',
            'keydown .HH-ResumeBuilder-Component-Area-Input': '_preventKeydown',
            'change .HH-ResumeBuilder-Component-Area-Input': '_onChange',
            'focusout .HH-ResumeBuilder-Component-Area-Input': '_onFocusOut'
        },

        initialize: function(options) {
            this.area = {
                areas: options.area.attributes
            };

            this._orderArea(this.area);

            this._initializeSuggest();
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

            return this;
        },

        onSelectSuggest: function(data) {
            this.$el.find('.HH-ResumeBuilder-Component-Area-Input').val(data.text);
            this.suggest.hide();
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

        _updateSuggest: function(event) {
            this._updateValues();
            this.suggest.update(this.name, this.width);
            this.suggest.processKey(event);
        },

        _updateValues: function() {
            var input = $('.HH-ResumeBuilder-Component-Area-Input');

            this.name = input.val();
            this.width = input.width();
        },

        _onChange: function() {
            this._updateValues();

            // Суть в том, что при клике в саджесте, у нашего поля ввода с не до конца введённым значением
            // срабатывает событие change. Из-за того, что поле не заполнено до конца, не находится id-шник города,
            // в итоге, триггерится 'selectArea' с нулевым id, а потом, после срабатывания _onChange по
            // выбору элемента из саджсеста, триггерится корректный id.
            // В итоге, из-за этого страдал блок метро, который лишний раз скрывал себя.
            if (this.suggest.isShow) {
                return;
            }

            var node = this._findNodeByName(this.name, this.area);

            if (node) {
                this.id = node.id;
            } else {
                this.id = 0;
            }

            if (this.previousId !== this.id || !this.id) {
                this.trigger('selectArea', this.id);
            }

            this.previousId = this.id;
        },

        _preventKeydown: function(event) {
            this.suggest.preventKeydown(event);
        },

        _onFocusOut: function() {
            this.suggest.hide();
            this._onChange();
        }
    });
});
