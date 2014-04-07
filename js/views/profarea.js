define([
    'jquery',
    'underscore',
    'backbone',
    'views/specialization',
    'text!templates/profarea.html'
], function(
    $,
    _,
    Backbone,
    SpecializationView,
    ProfareaTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(ProfareaTemplate),

        componentName: 'profarea',

        initialize: function(options) {
            this.resume = options.resume;
            this.specializations = options.specializations;
            this.maxCount = options.resume.conditions.get('specialization').max_count;
        },

        fill: function(attributes) {

        },

        takeback: function(attributes) {
            var $specializations;

            $specializations = this.$el.find('.HH-ResumeSection-ControlSpecialization');
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
        },

        render: function() {
            var data,
                specializationData;

            specializationData = {
                specializationIds: this.resume.specializationIds(),
                specializationNames: this.resume.specializationNames()
            };

            data = {
                resume: $.extend({}, this.resume.attributes, specializationData),
                specializations: this.specializations.map(function(specialization) {
                    return specialization.attributes;
                })
            };

            this.$el.html(this.template(data));

            this.bindSpecializationSelect();

            return this;
        },

        updateSpecializationList: function(force, id) {
            var specialization,
                specializationView;

            if (force) {
                this.$('.HH-SpecializationControl-Select').val(id);
            }

            specialization = this.specializations.get(id);
            specializationView = new SpecializationView({
                model: specialization,
                specializationIds: this.resume.specializationIds(),
                maxCount: this.maxCount
            });
            this.$el.find('.HH-ResumeSection-SpecializationList').html(specializationView.render().el);

            this.trigger('profarea:change', id);
        },

        bindSpecializationSelect: function() {
            var that = this,
                $select;

            $select = this.$('.HH-SpecializationControl-Select');
            $select.off('change').on('change', function() {
                if (this.selectedIndex !== -1) {
                    that.updateSpecializationList(false, this[this.selectedIndex].value);
                }
            });
            $select.trigger('change');
        }
    });
});
