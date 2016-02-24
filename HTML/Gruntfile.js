module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['www'],
		concat: {
			js: {
				src: 'src/js/**/*.js',
				dest: 'www/js/main.js'
			},
			css: {
				src: 'src/css/*.scss',
				dest: 'www/css/main.scss'
			}
		},
        sass: {
			dist: {
				files: [{
					expand: true,
					cwd: 'www/css',
					src: ['main.scss'],
					dest: 'www/css',
					ext: '.css'
				}]
			}
		},
		uglify: {
			'www/js/main.min.js': ['www/js/main.js']
		},
		copy: {
			img: {
				expand: true,
				src: 'src/img/*',
				dest: 'www/img/',
				flatten: true
			},
			html: {
				cwd: 'src/templates/',
				src: '**/*.html',
				dest: 'www/templates/',
				expand: true
			}
		},
		cssmin: {
			'www/css/main.min.css': 'www/css/main.css'
		},
		watch: {
			css: {
				files: ['src/css/*.scss', 'src/templates/*.html'],
				tasks: ['clean', 'concat:css', 'sass', 'cssmin', 'copy'],
				options: {
					spawn: false,
					livereload: true,
				}
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['clean', 'concat:css', 'sass', 'cssmin', 'copy']);
	grunt.registerTask('dev', ['watch']);

};
