define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';
    return Backbone.Model.extend({

        validationRules: {},
        htmlAttributes:{},
        
        initialize: function(options) {
            this.resume = options.resume;
        },

        url: function () {
            if (this.resume && !this.resume.isNew()) {
                return ['https://api.hh.ru/resumes', this.resume.id, 'conditions'].join('/');
            } else {
                return 'https://api.hh.ru/resume_conditions';
            }
        },

        getRulesFor: function(attribute) {
            return this.attributes[attribute];
        },

        getRules: function() {
            return this.attributes;
        },

        _formatRules: function() {
            _.each(this.attributes, function(value, key, list){
                if (typeof(value.fields) !== 'undefined') {
                    this._formatRules.call(value);
                } else {
                    this.validationRules[key] = value;
                };
            })
        }

    });
});
