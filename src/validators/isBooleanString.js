/**
 * Determines if the provided value is one of the valid boolean strings
 *
 * @param  mixed    value
 *
 * @return bool
 */
module.exports = function(value)
{
	return ['and', 'or'].indexOf(value) !== -1;
};