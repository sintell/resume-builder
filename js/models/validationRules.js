define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';


    // Выранивает объект с правилами
    // из O = {
    //     "site": {
    //         "required": false,
    //         "fields":{
    //             "type": {
    //                 "rule1": "val1",
    //                 "rule2": "val2"
    //             },
    //             "url": {
    //                 "rule1": "val3",
    //                 "rule2": "val4"
    //             }
    //         }
    //     }
    // }
    // 
    // получаем O = {
    //     "site": {
    //         "required": false
    //     },
    //     "site.type": {
    //         "rule1": "val1",
    //         "rule2": "val2"
    //     },
    //     "site.url": {
    //         "rule1": "val3",
    //         "rule2": "val4"
    //     }
    // }


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
