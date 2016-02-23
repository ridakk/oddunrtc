module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      main_app: {
        src: ['public/main/js/**/*.js'],
        dest: 'public/dist/main/main_app.js',
      }
    },
    uglify: {
      main_app: {
        options: {
          sourceMap: true,
          sourceMapName: 'public/dist/main/sourcemap.map'
        },
        files: {
          'public/dist/main/main_app.min.js': ['public/dist/main/main_app.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);
};
