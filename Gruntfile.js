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
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-mocha-phantomjs');

	grunt.registerTask('default', ['build', 'mocha_phantomjs:all']);
	grunt.registerTask('report', ['build', 'mocha_phantomjs:report'])
};