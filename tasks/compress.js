module.exports = function(grunt)
{
	grunt.config('compress', {
		main: {
			files: [
				{
					expand: true,
					src: ['build/*.js'],
					dest: '.'
				}
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compress');
};