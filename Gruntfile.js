module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      main_app: {
        src: grunt.file.readJSON('main_app_files.json'),
        dest: 'public/dist/main_app.js'
      },
      anonymous_app: {
        src: grunt.file.readJSON('anonymous_app_files.json'),
        dest: 'public/dist/anonymous_app.js'
      }
    },
    uglify: {
      main_app: {
        files: {
          'public/dist/main_app.min.js': ['public/dist/main_app.js']
        }
      },
      anonymous_app: {
        files: {
          'public/dist/anonymous_app.min.js': ['public/dist/anonymous_app.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);
};
