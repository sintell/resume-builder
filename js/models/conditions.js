define(['underscore', 'backbone', 'config'], function(_, Backbone, Config) {
    'use strict';

    return Backbone.Model.extend({
        initialize: function(attributes, options) {
            this.resume = options.resume;
        },

        url: function() {
            if (this.resume && !this.resume.isNew()) {
                return [Config.apiUrl, 'resumes', this.resume.id, 'conditions'].join('/');
            } else {
                return [Config.apiUrl,'resume_conditions'].join('/');
            }
        },

        getRulesFor: function(attributePath) {
            if (typeof attributePath === 'undefined') {
                return;
            }
            var path = attributePath.split('.');
            var o = {};
            for(var i = 0, size = path.length; i < size; i++) {
                if(typeof(o.fields) !== 'undefined') {
                    o = o.fields[path[i]] || this.get(path[i]);
                } else {
                    o = o[path[i]] || this.get(path[i]);
                }
            }
            return o;
        },

        getRules: function() {
            return this.attributes;
        }
    });
});