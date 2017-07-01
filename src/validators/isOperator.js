/**
 * Determines if the provided value is one of the valid operators
 *
 * @param  mixed    value
 *
 * @return bool
 */
module.exports = function(value)
{
	var operators = ['=', '>', '>=', '<', '<=', '!=', 'in', 'not in', 'like', 'not like', 'exists', 'not exists', 'between', 'not between'];

	return operators.indexOf(value) !== -1;
};