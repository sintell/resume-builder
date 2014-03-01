define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        template: _.template($('#HH-ResumeBuilder-ResumeTemplate').html()),

        events: {
            'click .HH-ResumeSection-Switch': '_edit',
            'click .HH-ResumeSection-Submit': '_submit'
        },

        initialize: function(attributes, options) {
            this.dictionary = options.dictionary;
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            var data = $.extend({}, {
                resume: this.model.attributes
            }, {
                dictionary: this.dictionary.attributes
            });

            this.$el.html(this.template(data));
            
            return this;
        },

        _edit: function(event) {
            var $controls,
                $section;

            event.preventDefault();

            $section = $(event.currentTarget).closest('.HH-Resume-ResumeSection');
            $controls = $section.find('.HH-ResumeSection-Control');
            $controls.toggleClass('control_viewing').toggleClass('control_editing');
        },

        _submit: function(event) {
            var $section,
                attributes = {},
                prefix,
                that = this;

            event.preventDefault();

            $section = $(event.currentTarget).closest('.HH-Resume-ResumeSection');
            $section.find('.HH-ResumeSection-ControlTextbox').each(function(index, textbox) {
                that._saveAttribute(
                    attributes,
                    textbox.getAttribute('data-hh-namespace'),
                    textbox.getAttribute('name'),
                    textbox.value
                );
            });
            $section.find('.HH-ResumeSection-ControlCheckbox').each(function(index, checkbox) {
                if (checkbox.checked) {
                    that._saveAttribute(
                        attributes,
                        checkbox.getAttribute('data-hh-namespace'),
                        checkbox.getAttribute('name'),
                        checkbox.value
                    );
                }
            });

            this.model.save(attributes, {patch: true});
        },

        _saveAttribute: function(attributes, namespace, key, value) {
            if (namespace !== null) {
                if (!attributes.hasOwnProperty(namespace)) {
                    attributes[namespace] = {};
                }
                attributes[namespace][key] = value;
            } else {
                attributes[key] = value;
            }
        }
    });
});