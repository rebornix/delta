module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        delta: {
            root: '.',
            app: 'src',
            dist: 'drop',
            tmp: '.tmp'
        },

        clean: ['<%= delta.tmp %>', '<%= delta.dist %>'],

        bowerInstall: {
            app: {
                src: ['<%= delta.app %>/index.html'],
                ignorePath: '<%= delta.app %>/'
            }
        },

        less: {
            '<%= delta.app %>/css/delta.css': ['<%= delta.app %>/app/styles/less/master.less'],
            '<%= delta.app %>/css/vendor.css': ['<%= delta.app %>/bower_components/bootstrap/less/bootstrap.less']
        },

		copy: {
            dist: {
                files: [
					{
                        expand: true,
                        cwd: '<%= delta.app %>/fonts/',
                        src: ['**/*.{ttf,eot,svg,woff}'],
                        dest: '<%= delta.dist %>/fonts/'
                    },

                    {
                        expand: true,
                        cwd: '<%= delta.app %>/',
                        src: ['*.{html,ico,js,json}'],
                        dest: '<%= delta.dist %>/'
                    }
                ]
            }
        },

		ngmin: {
            dist: {
                files: {
                    '<%= delta.tmp %>/concat/js/delta.js': ['<%= delta.tmp %>/concat/js/delta.js']
                }
            }
        },

        uglify: {
            options: {
                compress: {
                    drop_console: true
                },
                mangle: {
                    except: ['$compile', '$scope']
                }
            }
        },

		useminPrepare: {
            html: '<%= delta.app %>/index.html',
            options: {
                dest: '<%= delta.dist %>',
                staging: '<%= delta.tmp %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['concat', 'cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

		rev: {
            dist: {
                files: {
                    src: [
            '<%= delta.dist %>/js/*.js',
            '<%= delta.dist %>/css/*.css'
                    ]
                }
            }
        },

		usemin: {
            html: ['<%= delta.dist %>/index.html'],
            options: {
                assetsDirs: ['<%= delta.dist %>']
            }
        },

        express:{
            options: {
                port: 9000
            },
            dev: {
                options: {
                    script: '<%= delta.app %>/server.js'
                }
            },
			dist: {
                options: {
                    script: '<%= delta.dist %>/server.js'
                }
            }
        },

		deploy: {
            configFile: '<%= delta.root %>/DeployConfig.json'
        },

		watch: {
			express: {
                files: ['<%= delta.app %>/*.js'],
                tasks: ['express:dev']
            },
            less: {
                files: ['<%= delta.app %>/app/styles/less/*.less'],
                tasks: ['less']
            }
		}
    });

    // Plugin tasks.
	grunt.loadNpmTasks('grunt-http');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-bower-install');

	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Custom tasks.
    grunt.task.loadTasks('tasks');

    // Alias tasks
    grunt.registerTask('dev', ['clean', 'bowerInstall', 'less', 'express:dev','watch']);
	grunt.registerTask('prod', ['clean', 'bowerInstall', 'useminPrepare', 'copy', 'concat', 'ngmin', 'uglify', 'cssmin', 'rev', 'usemin']);
	grunt.registerTask('serve', ['prod', 'express:dist', 'watch']);
};
