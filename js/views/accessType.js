define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/accessType.html'
], function(
    $,
    _,
    Backbone,
    AccessTypeTemplate
) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-AccessType',

        componentName: 'access-type',

        consts: {
            WHITE_LIST: 'whitelist',
            BLACK_LIST: 'blacklist'
        },

        events: {
            'change .HH-AccessType-Radio': '_select',
            'click button': '_showModal'
        },

        template: _.template(AccessTypeTemplate),

        initialize: function(options, modal) {
            this.accessTypes = options.dictionary.attributes.resume_access_type;
            this.modal = modal;

            this.listenTo(this.modal, 'selectData', this.onSelectModal)
        },

        fill: function(attributes) {
            this.access = attributes.access;
        },

        render: function() {
            var data;

            data = {
                access: this.access,
                accessTypes: this.accessTypes,
                consts: this.consts
            };

            this.$el.html(this.template(data));

            return this;
        },

        takeback: function(attributes) {
            this.modal.hide();

            attributes.access= this.access;
        },

        onSelectModal: function(data) {
            this.access[this.editingList] = data;
            this.editingList = undefined;
            this.render();
        },

        _select: function(event) {
            event.preventDefault();

            this.access.type.id = $(event.currentTarget).val();
        },

        _showModal: function(event) {
            this.editingList = $(event.currentTarget).data('hh-list');
            this.modal.show(this.access[this.editingList]);
        }
    });
});