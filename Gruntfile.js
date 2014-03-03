module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: ".",
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('server', 'Start the oauth server', function() {
        grunt.log.writeln('Started oauth server on port 3000');
        require('./server/app.js').listen(3000);
    });
    grunt.registerTask('default', ['server','connect']);

};