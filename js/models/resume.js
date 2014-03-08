define(['underscore', 'backbone', 'models/conditions'], function(_, Backbone, Conditions) {
    'use strict';

    return Backbone.Model.extend({
        defaults: {
            area: {},
            metro: {},
            gender: {},
            birth_date: '1993-01-01',
            salary: {},
            employment: {},
            schedule: {},
            business_trip_readiness: {},
            travel_time: {},
            specialization: [{profarea_id: null}],
            relocation: {type:{}}
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

            this.ready = false;
            this.conditions = new Conditions(
                {},
                {resume: this}
            );

            $.when(this.conditions.fetch()).then(function() {
                that.ready = true;
                that.trigger('sync');
            });
        },

        url: function() {
            return this.get('url');
        },

        toJSON: function() {
            return _.omit(this.attributes, this.readOnly);
        },

        specializationNames: function() {
            var names;

            names = this.get('specialization').map(function(specialization) {
                return specialization.name;
            });

            return names.join(', ');
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