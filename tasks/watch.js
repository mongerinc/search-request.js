module.exports = function(grunt)
{
	grunt.config('watch', {
		scripts: {
			files: [
				'src/**/*.js',
				'tests/**/*.js',
			],
			tasks: ['browserify', 'karma']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
};