requirejs.config({
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        text: 'lib/text',
        templates: '../templates',
        config: '../config/config'
    }
});

requirejs(['backbone', 'app'], function(Backbone, App) {
    'use strict';
    new App();
});