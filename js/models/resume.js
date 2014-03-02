define(['underscore', 'backbone', 'models/validator'], function(_, Backbone, Validator) {
    'use strict';

    return Backbone.Model.extend({
        defaults: {
            salary: {},
            employment: {},
            schedule: {},
            business_trip_readiness: {},
            travel_time: {},
            specialization: []
        },

        readOnly: [
            '_progress',
            'photo',
            'updated_at',
            'moderation_note',
            'blocked',
            'finished',
            // TODO удалить строки ниже после реализации соответствующих секций
            'skills',
            'skill_set',
            'experience'
        ],

        initialize: function() {
            var that = this;

            this.validator = new Validator({}, {
                resume: this
            });

            $.when(this.validator.fetch()).then(function() {
                that.trigger('sync');
            });
        },

        url: function() {
            return this.get('url');
        },

        toJSON: function(options) {
            return _.omit(this.attributes, this.readOnly);
        },

        validate: function(attributes, options) {
            
        },

        specializationNames: function() {
            var names;

            if (this.get('specialization').map) {
                names = this.get('specialization').map(function(specialization) {
                    return specialization.name;
                });

                return names.join(', ');
            } else {
                return '';
            }
        },

        specializationIds: function() {
            if (this.get('specialization').map) {
                return this.get('specialization').map(function(specialization) {
                    return specialization.id;
                });
            } else {
                return [];
            }
        }
    });
});