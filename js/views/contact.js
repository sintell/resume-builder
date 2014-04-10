define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/contact.html'
], function(
    $,
    _,
    Backbone,
    ContactTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(ContactTemplate),

        events: {
            'click .HH-Contact-Button': '_switch'
        },

        initialize: function(options) {
            var that = this;

            this.componentName = options.componentName;
            this.contactType = options.contactType;
            this.verboseName = options.verboseName;
        },

        render: function() {
            var data;

            data = $.extend({}, this.model.attributes, {
                contact: {
                    comment: this.comment,
                    name: this.componentName,
                    preferred: this.preferred,
                    value: this.value,
                    verboseName: this.verboseName,
                    isPresented: this.isPresented
                }
            });

            this.$el.html(this.template(data));

            return this;
        },

        fill: function(attributes) {
            var contact,
                that = this;

            contact = _.find(attributes.contact, (function(c) {
                return c.type.id === that.componentName;
            }));

            if (contact !== void 0) {
                if (this.contactType === 'phone') {
                    this.value = contact.value.country + contact.value.city + contact.value.number;
                } else if (this.contactType === 'email') {
                    this.value = contact.value;
                }
                this.comment = contact.comment;
                this.preferred = contact.preferred;
                this.isPresented = true;
            } else {
                this.isPresented = false;
            }
        },

        takeback: function(attributes) {
            var contact,
                phone;

            if (!this.isPresented) {
                return;
            }

            contact = {
                type: {
                    id: this.componentName
                },
                comment: this.$('.HH-Contact-Comment').val(),
                preferred: this.$('.HH-Contact-Preferred').get(0).checked
            };

            if (!attributes.contact) {
                attributes.contact = [];
            }

            if (this.contactType === 'phone') {
                phone = this.$('.HH-Contact-Value').val();
                contact.value = {
                    country: phone.substr(0, 1),
                    city: phone.substr(1, 3),
                    number: phone.substr(4)
                };
            } else if (this.contactType === 'email') {
                contact.value = this.$('.HH-Contact-Value').val();
            }

            attributes.contact.push(contact);
        },

        _switch: function(event) {
            event.preventDefault();

            this.isPresented = !this.isPresented;
            this.value = null;
            this.comment = null;
            this.preferred = false;
            this.render();
            this.$('.HH-ResumeSection-Inner').toggleClass('section_viewing section_editing');
            this.$('.HH-ResumeSection-Control').toggleClass('control_viewing control_editing');
        }
    });
});