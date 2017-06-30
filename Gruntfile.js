
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});

	//load npm and any external tasks
	grunt.loadTasks('tasks');

	// Default task(s).
	grunt.registerTask('default', ['browserify', 'karma']);

	//runs the watch and karma:continuous tasks
	grunt.registerTask('catch', ['concurrent:watchAndTest']);

	//run all test suites
	grunt.registerTask('test', ['browserify', 'karma']);
};
