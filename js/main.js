requirejs.config({
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone'
    }
});

requirejs(['app'], function(App) {
    'use strict';

    var app = new App();
});