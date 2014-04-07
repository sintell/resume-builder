var config = require('./config/config.js');
var modRewrite = require('connect-modrewrite')
module.exports = function(grunt) {
    'use strict';
    
    // Конфигурация задач
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: config.staticServerPort,
                    base: ['.'],
                    livereload: true,
                    middleware: function(connect, options) {
                        var middlewares;
                        middlewares = [];
                        middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]']));
                        options.base.forEach(function(base) {
                            middlewares.push(connect['static'](base));
                        });
                        return middlewares;
                      }
                }
            }
        },

        watch: {
            all:{
                files: ['js/*.js', 'css/*.css', '*.html'],
                options: {
                    livereload: true,
                }
            }
        },

        express: {
            default_option: {
                options: {
                    port: config.oauthServerPort,
                    server: 'server/app.js',
                    serverreload: true
                }
            }
        },

        forever: {
            oauth: {
                options: {
                    index: 'server/index.js',
                    logDir: 'logs/'
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-forever');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-connect');

    
    grunt.registerTask('default', ['express', 'connect', 'watch']);
    grunt.registerTask('oauth', ['express', 'express-keepalive']);
};
