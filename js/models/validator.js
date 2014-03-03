define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    return Backbone.Model.extend({
        initialize: function(attributes, options) {
            this.resume = options.resume;
        },

        url: function() {
            if (this.resume && !this.resume.isNew()) {
                return ['https://api.hh.ru/resumes', this.resume.id, 'conditions'].join('/');
            } else {
                return 'https://api.hh.ru/resume_conditions';
            }
        },

        // TODO удалить после реализации соответствующих секций
        blackList: [
            'skill_set'
        ],

        validateResume: function(resumeAttributes) {
            var errors = [];

            resumeAttributes = _.omit(resumeAttributes, this.blackList);

            for (var key in this.attributes) {
                this._validateAttribute(resumeAttributes[key], this.attributes[key], key, errors);
            }

            return errors;
        },

        _validateAttribute: function(attributes, conditions, key, errors) {
            if (conditions.hasOwnProperty('fields') ) {
                for (var key in conditions.fields) {
                    this._validateAttribute(attributes[key], conditions.fields[key], key, errors);
                }
            } else {
                // TODO проверять условие required
                if (!attributes) {
                    return;
                }

                if (conditions.max_length && attributes.length > conditions.max_length) {
                    errors.push(key);
                }

                if (conditions.min_length && attributes.length < conditions.min_length) {
                    errors.push(key);
                }

                if (conditions.max_count && attributes.length > conditions.max_count) {
                    errors.push(key);
                }

                if (conditions.min_count && attributes.length < conditions.min_count) {
                    errors.push(key);
                }

                if (conditions.regexp && !(new RegExp(conditions.regexp).test(attributes))) {
                    errors.push(key);
                }
            }
        }
    });
});