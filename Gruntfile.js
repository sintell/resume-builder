var config = require('./config/config.js')

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
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');


    grunt.registerTask('oauth-server', 'Start the oauth server', function() {
        grunt.log.writeln('Started oauth server on port: ' + config.oauthServerPort);
        require('./server/app.js').listen(config.oauthServerPort);
    });
    
    grunt.registerTask('default', ['oauth-server','connect', 'watch']);
};
