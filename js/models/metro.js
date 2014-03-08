define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    return Backbone.Model.extend({
        setCity: function(id){
            this.id = id;
        },

        url: function() {
            return 'https://api.hh.ru/metro/' + this.id;
        },

        parse: function(responce){
            if (responce.description){
                return null;
            }

            return responce;
        }
    });
});