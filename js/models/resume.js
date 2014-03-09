define([
    'underscore',
    'backbone',
    'models/conditions',
    'models/validator',
    'config',
    'utils'
], function(
    _,
    Backbone,
    Conditions,
    Validator,
    Config,
    Utils
) {
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
            relocation: {type:{}},
            updated_at: '',
            total_views: 0,
            new_views: 0,
            access: {type:{}},
            status: {},
            _progress: {}
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

            $.when(this.valrul.fetch()).then(function(){
                console.log(that.valrul.getRules());
            })
        },

        url: function() {
            if (this.isNew()) {
                return [Config.apiUrl, 'resumes'].join('/');
            } else {
                return [Config.apiUrl, 'resumes', this.get('id')].join('/');
            }
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
        },

        data: function() {
            var data,
                that = this,
                MS_IN_HOURS = 3600000,
                MS_IN_MINUTES = 60000,
                HOURS_BETWEEN_UPDATES = 4;

            data = {
                isNew: this.isNew(),

                isPublished: this.has('status') && this.get('status').id === 'published',

                canBeUpdated: this.has('updated_at') &&
                              new Date() - new Date(this.get('updated_at')) > MS_IN_HOURS * HOURS_BETWEEN_UPDATES,

                timeBeforeUpdate: (function() {
                    var ms,
                        hours,
                        minutes;

                    if (that.has('updated_at')) {
                        ms = MS_IN_HOURS * HOURS_BETWEEN_UPDATES - (new Date() - new Date(that.get('updated_at')));
                        hours = Math.floor(ms / MS_IN_HOURS);
                        minutes = Math.floor((ms - hours * MS_IN_HOURS) / MS_IN_MINUTES);

                        return {
                            hours: hours > 0 ? [hours, Utils.hoursToRussian(hours)].join(' ') : null,
                            minutes: minutes > 0 ? [minutes, Utils.minutesToRussian(minutes)].join(' ') : null,
                        };
                    } else {
                        return 0;
                    }
                })()
            };

            return $.extend({}, this.attributes, data);
        }
    });
});