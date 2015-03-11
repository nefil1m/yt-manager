'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      files: {
        expand: true,
        cwd: 'src/js',
        src: ['**/*.js', '!**/*.min.js'],
        dest: 'src/js/min/',
        rename: function(dest, src) {
          var folder = src.substring(0, src.lastIndexOf('/'));
          var filename = src.substring(src.lastIndexOf('/'), src.length);
          filename = filename.substring(0, filename.lastIndexOf('.'));
          return dest + folder + filename + '.min.js';
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      build: {
        files: {
          'build/js/scripts.js': [
                                  'src/js/min/app.min.js',
                                  'src/js/min/routes.min.js',
                                  'src/js/min/services/*.min.js',
                                  'src/js/min/controllers/*.min.js',
                                  'src/js/min/directives/*.min.js'
                                  ]
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.html'],
            dest: 'build/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'src/templates/',
            src: ['*.html'],
            dest: 'build/templates/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'src/libs/',
            src: ['**/*.min.js', '**/*.min.css', '**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff', '**/*.woff2'],
            dest: 'build/libs',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'src/img/',
            src: ['*.*'],
            dest: 'build/img/',
            filter: 'isFile'
          }
        ]
      }
    },
    less: {
      src: {
        options: {
          paths: ['src/less/']
        },
        files: {
          'build/css/styles.css': 'src/less/styles.less'
        }
      },
      dev: {
        files: {
          'src/css/styles.css': 'src/less/styles.less'
        }
      }
    },
    watch: {
      html: {
        files: ['src/**/*.html'],
        tasks: ['copy'],
        options: {
          livereload: true
        }
      },
      less: {
        files: 'src/less/*.less',
        tasks: ['less'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['src/js/**/*.js', '!**/*.min.js'],
        tasks: ['uglify', 'concat'],
        options: {
          livereload: true
        }
      },
      dev: {
        files: ['src/less/**/*.*'],
        tasks: ['less:dev'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('build', ['watch']);
  grunt.registerTask('dev', ['watch:dev']);

};
