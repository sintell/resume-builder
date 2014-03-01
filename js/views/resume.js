define([
    'jquery',
    'underscore',
    'backbone',
    'views/specialization'
], function($, _, Backbone, SpecializationView) {
    'use strict';

    return Backbone.View.extend({
        template: _.template($('#HH-ResumeBuilder-ResumeTemplate').html()),

        events: {
            'click .HH-ResumeSection-Switch': '_edit',
            'click .HH-ResumeSection-Submit': '_submit'
        },

        initialize: function(attributes, options) {
            this.dictionary = options.dictionary;
            this.specializations = options.specializations;

            this.listenTo(this.model, 'sync', this.render);
        },

        render: function() {
            var resumeData,
                specializationsData,
                templateData;

            resumeData = $.extend({},
                this.model.attributes, {
                    specializationNames: this.model.specializationNames()
                }
            );

            specializationsData = this.specializations.map(function(specialization) {
                return specialization.attributes;
            });

            templateData = {
                resume: resumeData,
                dictionary: this.dictionary.attributes,
                specializations: specializationsData
            };

            this.$el.html(this.template(templateData));
            this._bindSelect();

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
                that = this;

            event.preventDefault();

            $section = $(event.currentTarget).closest('.HH-Resume-ResumeSection');
            $section.find('.HH-ResumeSection-ControlTextbox').each(function(index, textbox) {
                that._saveAttribute(
                    attributes,
                    textbox.getAttribute('data-hh-namespace'),
                    textbox.getAttribute('data-hh-name'),
                    textbox.value
                );
            });
            $section.find('.HH-ResumeSection-ControlRadio').each(function(index, checkbox) {
                if (checkbox.checked) {
                    that._saveAttribute(
                        attributes,
                        checkbox.getAttribute('data-hh-namespace'),
                        checkbox.getAttribute('data-hh-name'),
                        checkbox.value
                    );
                }
            });
            $section.find('.HH-ResumeSection-ControlCheckbox').each(function(index, checkbox) {
                if (checkbox.checked) {
                    that._saveArrayAttribute(
                        attributes,
                        checkbox.getAttribute('data-hh-namespace'),
                        checkbox.getAttribute('data-hh-name'),
                        checkbox.value
                    );
                }
            });

            $.when(this.model.save(attributes)).then(function() {
                that.model.fetch();
            });
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
        },

        _saveArrayAttribute: function(attributes, namespace, key, value) {
            var item = {};

            if (!attributes.hasOwnProperty(namespace)) {
                attributes[namespace] = [];
            }
            item[key] = value;
            attributes[namespace].push(item);
        },

        _bindSelect: function() {
            var id,
                specialization,
                specializationView,
                that = this,
                $select;

            $select = this.$el.find('.HH-SpecializationControl-Select');
            $select.off('change').on('change', function() {
                if (this.selectedIndex !== -1) {
                    id = this[this.selectedIndex].value;
                    specialization = that.specializations.get(id);
                    specializationView = new SpecializationView({
                        model: specialization,
                        specializationIds: that.model.specializationIds()
                    });
                    that.$el.find('.HH-ResumeSection-SpecializationList').html(specializationView.render().el);
                }
            });
            $select.trigger('change');
        }
    });
});