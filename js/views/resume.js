define([
    'jquery',
    'underscore',
    'backbone',
    'views/specialization',
    'views/birthDate',
    'views/area',
    'views/resumeCountryPicker',
    'views/metro',
    'views/relocation',
    'views/relocationArea',
    'views/header',
    'views/accessType',
    'views/accessTypeCompanyList',
    'text!templates/resume.html',
    'text!templates/citizenship.html',
    'text!templates/workTicket.html'
], function(
    $,
    _,
    Backbone,
    SpecializationView,
    BirthDateView,
    AreaView,
    ResumeCountryPicker,
    MetroView,
    RelocationView,
    RelocationAreaView,
    HeaderView,
    AccessTypeView,
    AccessTypeCompanyListModal,
    ResumeTemplate,
    CitizenshipTemplate,
    WorkTicketTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(ResumeTemplate),

        events: {
            'click .HH-ResumeSection-Switch': '_edit',
            'click .HH-ResumeSection-Submit': '_submit'
        },

        initialize: function(attributes, options) {
            var that = this;

            this.dictionary = options.dictionary;
            this.specializations = options.specializations;

            this.listenTo(this.model, 'sync', this.render);
            this.listenTo(this.model, 'load', function() {
                that.initializeComponents(options);
                that.render();
            });

            this.model.load();
        },

        initializeComponents: function(options) {
            var citizenshipOptions,
                workTicketOptions;

            $.extend(options, {resume: this.model});
            citizenshipOptions = $.extend({}, options, {template: CitizenshipTemplate});
            workTicketOptions = $.extend({}, options, {template: WorkTicketTemplate});

            this.components = [];
            this.components.push(new BirthDateView());
            this.components.push(new AreaView(options));
            this.components.push(new ResumeCountryPicker(citizenshipOptions, {
                name: 'citizenship',
                templateName: 'Citizenship',
                componentName: 'citizenship'
            }));

            this.components.push(new ResumeCountryPicker(workTicketOptions, {
                name: 'work_ticket',
                templateName: 'WorkTicket',
                componentName: 'work-ticket'
            }));
            this.components.push(new MetroView());
            this.components.push(new RelocationView(options));
            this.components.push(new RelocationAreaView(options));

            var modal = new AccessTypeCompanyListModal();
            this.components.push(modal);

            this.components.push(new AccessTypeView(options, modal));
        },

        render: function() {
            var resumeData,
                specializationsData,
                templateData,
                that = this;

            if (!this.model.ready) {
                return this;
            }

            resumeData = $.extend(
                {},
                this.model.attributes,
                {specializationNames: this.model.specializationNames()}
            );

            specializationsData = this.specializations.map(function(specialization) {
                return specialization.attributes;
            });

            templateData = {
                resume: resumeData,
                dictionary: this.dictionary.attributes,
                specializations: specializationsData,
                conditions: this.model.conditions.attributes
            };

            this.$el.html(this.template(templateData));
            this._bindSelect();

            this.components.forEach(function(component) {
                var container = that.$el.find([
                    '.HH-ResumeSection-Component[data-hh-component="',
                    component.componentName,
                    '"]'
                ].join(''));

                if (container.data('hh-depends')) {
                    var depends = container.data('hh-depends');
                    _.each(depends, function(dependency) {
                        var element = _.find(that.components, function(item) {
                            return item.componentName === dependency.component;
                        });

                        component.listenTo(element, dependency.event, component[dependency.callback]);
                    });
                }

                component.namespace = container.data('hh-namespace');
                component.fill(that.model.attributes);
                component.delegateEvents();
                container.html(component.render().el);
                container.contents().unwrap();
            });

            return this;
        },

        _edit: function(event) {
            var $controls,
                $section;

            event.preventDefault();

            $section = $(event.currentTarget).closest('.HH-Resume-ResumeSection');
            $section.find('.HH-ResumeSection-Switch').toggleClass('section__title-button_hidden');
            $controls = $section.find('.HH-ResumeSection-Control');
            $controls.toggleClass('control_viewing control_editing');
        },

        _submit: function(event) {
            var $controls,
                $section,
                $specializations,
                attributes = {},
                namespace,
                that = this;

            event.preventDefault();

            $section = $(event.currentTarget).closest('.HH-Resume-ResumeSection');
            namespace = $section.data('hh-namespace');
            $controls = $section.find('[data-hh-namespace=' + namespace + ']');

            $controls.filter('.HH-ResumeSection-ControlTextbox').each(function(index, textbox) {
                that._saveAttribute(attributes, textbox.getAttribute('data-hh-name'), textbox.value);
            });

            $controls.filter('.HH-ResumeSection-ControlRadio').each(function(index, radio) {
                if (radio.checked) {
                    that._saveAttribute(attributes, radio.getAttribute('data-hh-name'), radio.value);
                }
            });

            $specializations = $controls.filter('.HH-ResumeSection-ControlSpecialization');
            if ($specializations.length) {
                attributes.specialization = [];
            }
            $specializations.each(function(index, checkbox) {
                if (checkbox.checked) {
                    var obj = {};
                    obj[checkbox.getAttribute('data-hh-name')] = checkbox.value;
                    attributes.specialization.push(obj);
                }
            });

            this.components.forEach(function(component) {
                if (component.namespace === namespace) {
                    component.takeback(attributes);
                }
            });

            this.model.attributesToSave = _.keys(attributes);
            this.model.save(attributes, {
                wait: true,

                success: function() {
                    that.model.fetch();
                },

                // HH API отвечает пустым 201 Webpage Created на запрос POST /resumes, поэтому срабатывает колбэк error
                error: function(model, response, options) {
                    if (response.status === 201) {
                        that.model.collection.trigger('added');
                    }
                }
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
                        specializationIds: that.model.specializationIds(),
                        maxCount: that.model.conditions.get('specialization').max_count
                    });
                    that.$el.find('.HH-ResumeSection-SpecializationList').html(specializationView.render().el);
                }
            });
            $select.trigger('change');
        }
    });
});