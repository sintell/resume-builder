define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/resumeSection.html'
], function(
    $,
    _,
    Backbone,
    ResumeSectionTemplate
) {
    'use strict';

    return Backbone.View.extend({
        className: 'HH-Resume-ResumeSection',

        baseTemplate: _.template(ResumeSectionTemplate),

        events: {
            'click .HH-ResumeSection-Switch': '_switch',
            'click .HH-ResumeSection-Submit': '_submit'
        },

        initialize: function(options) {
            this.components = [];
            this.data = options.data;
            this.editMode = false;

            this.sidebar = options.sidebar;
        },

        render: function(data) {
            var that = this;

            this.$el.html(this.baseTemplate({title: this.title}));
            this.$el.find('.HH-ResumeSection-Content').replaceWith(this.template(data));

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

        _switch: function(event) {
            event.preventDefault();

            this.editMode = !this.editMode;

            if (this.editMode) {
                this.$('.HH-ResumeSection-Inner').toggleClass('section_viewing section_editing');
                this.$('.HH-ResumeSection-Control').toggleClass('control_viewing control_editing');
            } else {
                this.render(this.data());
            }
        },

        _submit: function(event) {
            var $controls,
                attributes = {},
                namespace,
                that = this;

            event.preventDefault();

            $controls = this.$el.find('[data-hh-namespace=' + this.namespace + ']');

            $controls.filter('.HH-ResumeSection-ControlTextbox').each(function(index, textbox) {
                that._saveAttribute(attributes, textbox.getAttribute('data-hh-name'), textbox.value);
            });

            $controls.filter('.HH-ResumeSection-ControlRadio').each(function(index, radio) {
                if (radio.checked) {
                    that._saveAttribute(attributes, radio.getAttribute('data-hh-name'), radio.value);
                }
            });

            this.components.forEach(function(component) {
                component.takeback(attributes);
            });

            this.editMode = !this.editMode;

            this.$('.HH-ResumeSection-Inner').toggleClass('section_loading');

            this.model.attributesToSave = _.keys(attributes);
            this.model.save(attributes, {
                wait: true,

                success: function() {
                    that.model.fetch({
                        success: function() {
                            that.sidebar.setProgressBar(that.model.get('_progress').percentage);
                            that.render(that.data());
                        }
                    });
                },

                // HH API отвечает пустым 201 Webpage Created на запрос POST /resumes, поэтому срабатывает колбэк error
                error: function(model, response, options) {
                    if (response.status === 201) {
                        console.log(response);
                        that.model.collection.trigger(
                            'added',
                            'new',
                            {newUrl: response.getResponseHeader('location')}
                        );
                    }

                    that.$('.HH-ResumeSection-Inner').toggleClass('section_loading');
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
        }
    });
});
