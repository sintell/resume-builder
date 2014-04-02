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
    var flatten = function (obj, into, prefix) {
        into = into || {};
        prefix = prefix || '';

        _.each(obj, function(val, key) {
            if (obj.hasOwnProperty(key)) {
                if (Object.keys(val).indexOf('fields') !== -1) {
                    into[prefix + key] = _.omit(val, 'fields');
                    flatten(val.fields, into, prefix + key + '.');
                }
                else {
                    into[prefix + key] = val;
                }
            }
        });

        return into;
    };

    return Backbone.Model.extend({

        validationRules: {},
        htmlAttributes:{},
        
        parse: function(data) {
            // return flatten(data);
            return data;
        },

        initialize: function(options) {
            this.resume = options.resume;
            this.fetch();
        },

        url: function () {
            console.log(this.resume)
            if (this.resume ) {
                return ['https://api.hh.ru/resumes', , 'conditions'].join('/');
            } else {
                return 'https://api.hh.ru/resume_conditions';
            }
        },

        getRulesFor: function(attributePath) {
            console.log(this.get('salary.fields.amount'));
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
        },

        _formatRules: function() {
            _.each(this.attributes, function(value, key, list){
                if (typeof(value.fields) !== 'undefined') {
                    this._formatRules.call(value);
                } else {
                    this.validationRules[key] = value;
                }
            });
        }

    });
});
