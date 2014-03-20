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

requirejs(['app'], function(App) {
    'use strict';

    var app = new App();
});