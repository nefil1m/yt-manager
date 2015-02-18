'use strict';

var path = require('path');

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                files: {
                    'build/js/scripts.js': ['src/js/**/*.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['*.html'],
                        dest: 'build/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/templates/',
                        src: ['*.html'],
                        dest: 'build/templates/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        less: {
            src: {
                options: {
                    paths: ['src/css/']
                },
                files: {
                    'build/css/styles.css': 'src/css/styles.less'
                }
            }
        },
        watch: {
            html: {
                files: ['src/*.html'],
                tasks: ['copy'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: 'src/css/*.less',
                tasks: ['less'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: 'src/js/**/*.js',
                tasks: ['uglify'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('default', ['watch']);

};
