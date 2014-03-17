define(['underscore', 'backbone', 'models/specialization'], function(_, Backbone, Specialization) {
    'use strict';

    return Backbone.Collection.extend({
        model: Specialization,

        url: 'https://api.hh.ru/specializations'
    });
});