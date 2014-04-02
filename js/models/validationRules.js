define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    return Backbone.Model.extend({
        
        initialize: function(options) {
            this.resumeId = options.id;
            this.fetch();
        },

        url: function () {
            if (this.resumeId) {
                return ['https://api.hh.ru/resumes', this.resumeId, 'conditions'].join('/');
            } else {
                return 'https://api.hh.ru/resume_conditions';
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
