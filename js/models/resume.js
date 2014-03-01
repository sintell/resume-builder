define(['underscore', 'backbone'], function(_, Backbone) {
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

        writeOnly: [
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

        url: function() {
            return this.get('url');
        },

        toJSON: function(options) {
            return _.omit(this.attributes, this.writeOnly);
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