define([
    'jquery',
    'underscore',
    'backbone',
    'views/specialization',
    'views/birthDate',
    'views/area',
    'views/citizenship',
    'views/workTicket',
], function($, _, Backbone, SpecializationView, BirthDateView, AreaView, CitizenshipView, WorkTicketView) {
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

            this.components = [];

            this.components.push(new BirthDateView());
            this.components.push(new AreaView(options));
            this.components.push(new CitizenshipView(options));
            this.components.push(new WorkTicketView(options));
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

            for (var i in this.components) {
                var component = this.components[i],
                    container = this.$el.find([
                        '.HH-ResumeSection-Component[data-hh-component="',
                        this.components[i].componentName,
                        '"]'
                    ].join(''));

                component.fill(this.model.attributes);
                container.html(component.render().el);
                container.contents().unwrap();
            }

            return this;
        },

        _edit: function(event) {
            var $controls,
                $section;

            event.preventDefault();

            $section = $(event.currentTarget).closest('.HH-Resume-ResumeSection');
            $section.find('.HH-ResumeSection-Switch').toggleClass('section__title-link_hidden');
            $controls = $section.find('.HH-ResumeSection-Control');
            $controls.toggleClass('control_viewing').toggleClass('control_editing');
        },

        _submit: function(event) {
            var $section,
                $specializations,
                attributes = {},
                that = this;

            event.preventDefault();

            $section = $(event.currentTarget).closest('.HH-Resume-ResumeSection');
            $section.find('.HH-ResumeSection-ControlTextbox').each(function(index, textbox) {
                that._saveAttribute(attributes, textbox.getAttribute('data-hh-name'), textbox.value);
            });
            $section.find('.HH-ResumeSection-ControlRadio').each(function(index, radio) {
                if (radio.checked) {
                    that._saveAttribute(attributes, radio.getAttribute('data-hh-name'), radio.value);
                }
            });
            $specializations = $section.find('.HH-ResumeSection-ControlSpecialization');
            if ($specializations.length > 0) {
                attributes.specialization = [];
            }
            $specializations.each(function(index, checkbox) {
                if (checkbox.checked) {
                    var obj = {};
                    obj[checkbox.getAttribute('data-hh-name')] = checkbox.value;
                    attributes.specialization.push(obj);
                }
            });

            for (var i in this.components) {
                this.components[i].takeback(attributes);
            }

            $.when(this.model.save(attributes)).then(function() {
                that.model.fetch();
            });
        },

        // Принимает строку вида "salary.amount" в параметре name и записывает value в attributes.salary.amount
        _saveAttribute: function(attributes, name, value) {
            var namespaces = name.split('.'),
                key;

            for (var i = 0; i < namespaces.length; i += 1) {
                key = namespaces[i];

                if (!attributes.hasOwnProperty(key)) {
                    attributes[key] = {};
                }

                if (i === namespaces.length - 1) {
                    attributes[key] = value;
                } else {
                    attributes = attributes[key];
                }
            }
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