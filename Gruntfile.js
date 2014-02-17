module.exports = function( grunt ) {
	'use strict';

	grunt.initConfig({
		mocha_phantomjs: {
			report: {
				options: {
					'reporter': 'xunit',
					'output': 'tests/results/result.xml',
					urls: ['tests/tests.html']
				}
			},
			all: ['tests/*.html']
		},
		build: {
			all: ['src/*.js']
		},
		concat: {
			options: {
				separator: '\n',
			},
			dist: {
				src: ['dist/simple.js', 'dist/simple.touch.js', 'dist/simple.tap.js'],
				dest: 'all/simple.js',
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-mocha-phantomjs');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['build', 'concat', 'mocha_phantomjs:all']);
	grunt.registerTask('report', ['build', 'mocha_phantomjs:report'])
};