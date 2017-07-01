/**
 * Determines if the provided value is integer-like
 *
 * @param  mixed    value
 *
 * @return bool
 */
module.exports = function(value)
{
	return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
};