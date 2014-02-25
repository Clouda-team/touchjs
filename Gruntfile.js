module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\n',
				banner: '/*! <%= pkg.name %> v<%= pkg.version %>  <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            basic: {
                src: ['src/intro.js', 'src/utils.js', 'src/event.js', 'src/config.js', 'src/gestures.js', 'src/api.js', 'src/outro.js'],
                dest: '<%= pkg.name.slice(0,-2) %>.js'
            },
			extras: {
				src: ['src/intro.js', 'src/utils.js', 'src/event.js', 'src/config.js', 'src/gestures.js', 'src/api.js', 'src/outro.js'],
                dest: 'dist/<%= pkg.name.slice(0,-2) %>-<%= pkg.version %>.js'
			}
        },
        jshint: {
            files: ['Gruntfile.js', 'src/utils.js', 'src/event.js', 'src/config.js', 'src/gestures.js', 'src/api.js']
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>.min v<%= pkg.version %>  <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    '<%= pkg.name.slice(0,-2) %>.min.js': ['<%= concat.basic.dest %>'],
					'dist/<%= pkg.name.slice(0,-2) %>-<%= pkg.version %>.min.js': ['<%= concat.basic.dest %>'],
                }
            }
        }

    });



    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'jshint', 'uglify']);

};