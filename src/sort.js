function Sort(field, direction)
{
	if (typeof field !== 'string')
		throw new Error("The sort field should be a string.");

	if (typeof direction !== 'string')
		throw new Error("The sort direction should be a string.");

	this.field = field;
	this.direction = direction;
}

Sort.prototype = {

	field: null,
	direction: null,

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
	getDirection: function()
	{
		return this.direction;
	},

	/**
	 * Changes the direction from 'asc' to 'desc' or vice versa
	 */
	changeDirection: function()
	{
		this.direction = this.direction === 'asc' ? 'desc' : 'asc';
	},

}

module.exports = Sort;