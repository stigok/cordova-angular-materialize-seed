module.exports = function (grunt) {
  grunt.initConfig({
    //
    // Vars
    //
    www: {
      src: './ng',
      dist: './cordova/www'
    },

    //
    // Run cordova builds and push to adb device
    //
    exec: {
      'cordova-build': {
        cmd: 'cordova build android',
        cwd: 'cordova/'
      },
      'adb-install': {
        // Replace existing app with -r
        cmd: 'adb install -r cordova/platforms/android/build/outputs/apk/android-debug.apk'
      }
    },

    less: {
      dev: {
        options: {
          ieCompat: false
        },
        files: {
          '<%= www.dist %>/styles/main.css': '<%= www.src %>/styles/main.less'
        }
      }
    },

    concat: {
      options: {
        banner: "'use strict';\n\n",
        separator: '\n',
        //sourceMap: true,
        //sourceMapStyle: 'inline',
        process: function (src, filepath) {
          return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        }
      },
      dist: {
        src: [
          //'<%= www.src %>/scripts/app.js',
          '<%= www.src %>/scripts/**/*.js'
        ],
        dest: '<%= www.dist %>/scripts/bundle.js'
      }
    },

    clean: {
      www: ['<%= www.dist %>']
    },

    copy: {
      www: {
        files: [
          {expand: true, cwd: '<%= www.src %>', src: ['**/*.!(less|js)'], dest: '<%= www.dist %>'},
          {expand: true, src: ['bower_components/**/*.@(css|js|woff*|ttf)'], dest: '<%= www.dist %>'}
        ]
      }
    },

    watch: {
      css: {
        files: ['<%= www.src %>/styles/**/*.less'],
        tasks: ['less'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['<%= www.src %>/scripts/**/*.js'],
        tasks: ['concat'],
        options: {
          livereload: true
        }
      },
      other: {
        files: ['<%= www.src %>/**/*.!(js|less)', 'Gruntfile.js'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      }
    },

    growl: {
      buildComplete: {
        title: 'Grunt',
        message: 'Build complete!'
      },
      pushed: {
        message: 'Pushed to device'
      },
      test: {
        message: '<%= cordova.packages.android %>'
      }
    },

    //
    // Development server
    //
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0',
        livereload: 35729,
        //base: '<%= www.dist %>'
        base: 'cordova/www'
      },
      livereload: {
        open: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-growl');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build', ['clean:www', 'concat', 'less', 'copy:www', 'growl:buildComplete']);
  grunt.registerTask('cordova-build', ['exec:cordova-build']);
  grunt.registerTask('serve', ['build', 'connect:livereload', 'watch']);
  grunt.registerTask('push', ['build', 'cordova-build', 'exec:adb-install', 'growl:pushed']);
};
