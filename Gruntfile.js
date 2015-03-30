'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      prod: {
        // expand: true,
        src: ['src/js/*.js',
              'src/js/directives/**/*.js',
              'src/js/services/*.js',
              'src/js/controllers/*.js'],
        dest: 'build/js/scripts.js'
      }
      // files: {
      //   expand: true,
      //   cwd: 'src/js',
      //   src: ['**/*.js', '!**/*.min.js'],
      //   dest: 'src/js/min/',
      //   rename: function(dest, src) {
      //     var folder = src.substring(0, src.lastIndexOf('/'));
      //     var filename = src.substring(src.lastIndexOf('/'), src.length);
      //     filename = filename.substring(0, filename.lastIndexOf('.'));
      //     return dest + folder + filename + '.min.js';
      //   }
      // }
    },
    // concat: {
    //   options: {
    //     separator: ';'
    //   },
    //   build: {
    //     files: {
    //       'build/js/scripts.js': [
    //                               'src/js/min/app.min.js',
    //                               'src/js/min/routes.min.js',
    //                               'src/js/min/services/*.min.js',
    //                               'src/js/min/controllers/*.min.js',
    //                               'src/js/min/directives/*.min.js'
    //                               ]
    //     }
    //   }
    // },
    copy: {
      prod: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.html'],
            dest: 'build/',
            filter: 'isFile'
          },
          // {
          //   expand: true,
          //   cwd: 'src/templates/',
          //   src: ['*.html'],
          //   dest: 'build/templates/',
          //   filter: 'isFile'
          // },
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
      prod: {
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
    "sails-linker": {
      prod: {
        options: {
          startTag: '<!-- scripts -->',
          endTag: '<!-- /scripts -->',
          fileTmpl: '<script src="%s"></script>',
          appRoot: 'build/'
        },
        files: {
          'build/index.html': [ 'build/libs/jquery/**/*.min.js',
                                'build/libs/angular/**/*.min.js',
                                'build/libs/**/*.min.js',
                                'build/js/scripts.js' ]
        }
      },
      dev: {
        options: {
          startTag: '<!-- scripts -->',
          endTag: '<!-- /scripts -->',
          fileTmpl: '<script src="%s"></script>',
          appRoot: 'src/'
        },
        files: {
          'src/index.html': [
              'src/libs/jquery/**/*.min.js',
              'src/libs/angular/**/*.min.js',
              'src/libs/**/*.min.js',
              'src/js/*.js',
              'src/js/services/*.js',
              'src/js/directives/**/*.js',
              'src/js/controllers/*.js'
          ]
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
        files: ['src/**/*.*'],
        tasks: ['sails-linker:dev', 'less:dev'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('build', ['copy:prod', 'uglify:prod', 'sails-linker:prod', 'less:prod']);
  grunt.registerTask('dev', ['sails-linker:dev', 'less:dev', 'watch:dev' ]);

};
