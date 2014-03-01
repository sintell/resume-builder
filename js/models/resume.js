define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    return Backbone.Model.extend({
        defaults: {
            salary: {},
            employment: {},
            schedule: {}
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
        }
    });
});