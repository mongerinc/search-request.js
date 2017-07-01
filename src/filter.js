function Filter(field, operator, value, boolean)
{
	if ((['in', 'not in', 'between', 'not between'].indexOf(operator) !== -1) && !Array.isArray(value))
		throw new Error("A filter with the '" + operator + "' operator must have an array value.");

	this.field = field;
	this.operator = operator;
	this.value = value;
	this.boolean = boolean;
}

Filter.prototype = {

	/**
	 * @return string
	 */
	getField: function()
	{
		return this.field;
	},

	/**
	 * @return string
	 */
	getOperator: function()
	{
		return this.operator;
	},

	/**
	 * @return mixed
	 */
	getValue: function()
	{
		return this.value;
	},

	/**
	 * @return string
	 */
	getBoolean: function()
	{
		return this.boolean;
	},

	/**
	 * @return bool
	 */
	isAnd: function()
	{
		return this.boolean === 'and';
	},

	/**
	 * @return bool
	 */
	isOr: function()
	{
		return this.boolean === 'or';
	},

}

module.exports = Filter;