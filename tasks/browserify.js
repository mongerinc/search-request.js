module.exports = function(grunt)
{
	grunt.config('browserify', {
		modules: {
			src: [
				'src/searchRequest.js'
			],
			dest: 'build/search-request.js'
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
};