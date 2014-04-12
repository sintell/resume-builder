define([
    'underscore',
    'backbone',
    'models/validator',
    'models/conditions',
    'config',
    'utils'
], function(
    _,
    Backbone,
    Validator,
    Conditions,
    Config,
    Utils
) {
    'use strict';

    var Resume = Backbone.Model.extend({
        const: {
            CAREER_START_PROFAREA: '15'
        },

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

            // Добавлены чтобы не было ошибок при создании нового резюме.
            updated_at: 'Никогда',
            total_views: 0,
            new_views: 0,
            access: {
                type: {
                    name: 'закрытое (резюме не видно никому)'
                }
            },
            status: {
                name: 'не опубликовано'
            },
            _progress: {
                percentage: 0
            },
            careerStart: false
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
                that.validator = new Validator({
                    conditions: that.conditions
                });
                that.ready = true;
                that.trigger('load');
            });

        },

        url: function() {
            if (this.isNew()) {
                return [Config.apiUrl, 'resumes'].join('/');
            } else {
                return [Config.apiUrl, 'resumes', this.id].join('/');
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
            var that = this;

            for (var key in response) {
                if (typeof(response[key]) === 'undefined' || response[key] === null) {
                    response[key] = this.defaults[key];
                }
            }

            if (response && response.specialization) {
                response.careerStart = response.specialization.some(function(s) {
                    return s.profarea_id === that.const.CAREER_START_PROFAREA;
                });
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
        },

        clone: function() {
            var that = this;

            $.ajax({
                type: 'POST',

                url: [Config.apiUrl, '/resumes?source_resume_id=', this.id].join(''),

                success: function(data, status, xhr) {
                    var location,
                        resume;

                    location = xhr.getResponseHeader('Location');
                    resume = new Resume({
                        url: [Config.apiUrl, location].join('')
                    });
                    that.collection.add(resume);
                    that.collection.trigger(
                        'added',
                        'clone',
                        {newUrl: location}
                    );
                }
            });
        }
    });

    return Resume;
});