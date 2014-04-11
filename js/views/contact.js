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

            contact = _.find(attributes.contact, function(c) {
                return c.type.id === that.componentName;
            });

            if (contact !== void 0) {
                this.fillContact(contact);
                this.comment = contact.comment;
                this.preferred = contact.preferred;
                this.isPresented = true;
            } else {
                this.isPresented = false;
            }
        },

        takeback: function(attributes) {
            var contact;

            if (!this.isPresented) {
                return;
            }

            contact = {
                type: {
                    id: this.componentName
                },
                comment: this.$('.HH-Contact-Comment').val(),
                preferred: this.$('.HH-Contact-Preferred').prop('checked')
            };

            if (!attributes.contact) {
                attributes.contact = [];
            }

            this.saveContact(contact);

            attributes.contact.push(contact);
        },

        _switch: function() {
            var $checkbox;

            $checkbox = this.$('.HH-Contact-Preferred');
            if ($checkbox.length && $checkbox.prop('checked')) {
                this.trigger('preferredRemoved');
            }

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
