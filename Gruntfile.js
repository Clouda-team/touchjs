module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\n'
            },
            dist: {
                src: ['src/intro.js', 'src/utils.js', 'src/event.js', 'src/config.js', 'src/gestures.js', 'src/api.js', 'src/outro.js'],
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'src/utils.js', 'src/event.js', 'src/config.js', 'src/gestures.js', 'src/api.js']
        }

    });



    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['concat', 'jshint']);

};