define([
    'jquery',
    'underscore',
    'backbone',
    'views/baseArea',
    'views/suggest',
    'views/areaModal',
    'text!templates/area.html'
], function(
    $,
    _,
    Backbone,
    BaseArea,
    Suggest,
    AreaModal,
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

            this.trigger('selectArea', this.id);
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
