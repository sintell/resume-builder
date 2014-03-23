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
            specialization: [],
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

        systemAttributes: [
            'id',
            'url'
        ],

        initialize: function() {

        },

        load: function() {
            var that = this;

            this.ready = false;
            this.conditions = new Conditions(
                {},
                {resume: this}
            );

            $.when(this.fetch(), this.conditions.fetch()).then(function() {
                that.ready = true;
                that.trigger('load');
            });
        },

        url: function() {
            return this.get('url');
        },

        toJSON: function() {
            var attributes;

            attributes = _.omit(this.attributes, this.readOnly);
            attributes = _.pick(attributes, this.systemAttributes.concat(this.attributesToSave));

            return attributes;
        },

        specializationNames: function() {
            var names;

            names = this.get('specialization').map(function(specialization) {
                return specialization.name;
            });

            return names.join(', ');
        },

        specializationIds: function() {
            return this.get('specialization').map(function(specialization) {
                return specialization.id;
            });
        },

        parse: function(response) {
            for (var key in response) {
                if (typeof(response[key]) === 'undefined' || response[key] === null) {
                    response[key] = this.defaults[key];
                }
            }

            return response;
        }
    });
});