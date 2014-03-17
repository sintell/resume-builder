var config = require('./config/config.js').config;

module.exports = function(grunt) {
    'use strict';

    // Конфигурация задач
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: config.staticServerPort,
                    base: '.',
                    livereload: true
                }
            }
        },

        watch: {
            all:{
                files: ['js/*.js', 'css/*.css', '*.html'],
                options: {
                    livereload: true,
                }
            },
            server: {
                files: ['server/*.js'],
                tasks: ['oauth-server'],
            }
        },

        express: {
            default_option: {
                options: {
                    port: 8081,
                    server: 'server/app.js'
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');


    
    grunt.registerTask('default', ['express','connect', 'watch']);
    grunt.registerTask('oauth', ['express','express-keepalive']);
};
