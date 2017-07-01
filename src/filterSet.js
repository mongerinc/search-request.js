var Filter = require('./filter'),
	isBooleanString = require('./validators/isBooleanString'),
	isOperator = require('./validators/isOperator');

function FilterSet(boolean)
{
	boolean = typeof boolean === 'undefined' ? 'and' : boolean;

	if (!isBooleanString(boolean))
		throw new Error("A filter set's boolean needs to be either 'and' or 'or'.");

	this.boolean = boolean;
	this.filters = [];
}

FilterSet.prototype = {

	/**
	 * Gets the boolean
	 *
	 * @return string
	 */
	getBoolean: function()
	{
		return this.boolean;
	},

	/**
	 * Gets the constituent sub-filters
	 *
	 * @return array
	 */
	getFilters: function()
	{
		return this.filters;
	},

	/**
	 * Adds the provided raw filters to the filter set
	 *
	 * @param  array    filters
	 */
	addFilters: function(filters)
	{
		var self = this;

		if (!Array.isArray(filters))
			throw new Error("A filter set's filters have to be an array.");

		filters.forEach(function(filter)
		{
			var instance;

			if (filter.filters)
			{
				instance = new FilterSet(filter.boolean);

				instance.addFilters(filter.filters);
			}
			else
			{
				instance = new Filter(filter.field, filter.operator, filter.value, filter.boolean);
			}

			self.filters.push(instance);
		});
	},

	/**
	 * Add a new filter condition
	 *
	 * @param  string|closure     column
	 * @param  mixed              operator    //if only two arguments are provided, this is the value
	 * @param  mixed              value
	 * @param  mixed              boolean
	 *
	 * @return this
	 *
	 * @throws Error
	 */
	where: function(field, operator, value, boolean)
	{
		boolean = typeof boolean === 'undefined' ? 'and' : boolean;

		//if the value is undefined, assume that operator is the value and the actual operator is '='
		if (typeof value === 'undefined')
		{
			value = operator;
			operator = '=';
		}

		//if the provided boolean is invalid, raise an exception
		if (!isBooleanString(boolean))
		{
			throw new Error("A filter's boolean needs to be either 'and' or 'or'.");
		}

		//if the field is a closure, assume this is a nested conditional
		if (typeof field === 'function')
		{
			return this.whereNested(field, boolean);
		}

		//if the operator isn't in the list of valid operators, assume the user is doing a null equality
		if (!isOperator(operator))
		{
			value = null;
			operator = '=';
		}

		//finally we can assume this is a simple filter that we can append onto the stack
		this.filters.push(new Filter(field, operator, value, boolean));

		return this;
	},

	/**
	 * Add an "or" filter
	 *
	 * @param  string|Closure     field
	 * @param  mixed              operator    //if only two arguments are provided, this is the value
	 * @param  mixed              value
	 *
	 * @return this
	 */
	orWhere: function(field, operator, value)
	{
		return this.where(field, operator, value, 'or');
	},

	/**
	 * Add a nested filter
	 *
	 * @param  Closure    callback
	 * @param  string     boolean
	 *
	 * @return this
	 */
	whereNested: function(callback, boolean)
	{
		boolean = boolean || 'and';

		var subFilterSet = new FilterSet(boolean);

		this.filters.push(subFilterSet);

		callback(subFilterSet);

		return this;
	},

	/**
	 * Add a between filter
	 *
	 * @param  string    field
	 * @param  array     values
	 * @param  string    boolean
	 * @param  bool      not
	 *
	 * @return this
	 */
	whereBetween: function(field, values, boolean, not)
	{
		operator = not ? 'not between' : 'between';

		return this.where(field, operator, values, boolean || 'and');
	},

	/**
	 * Add an or between filter
	 *
	 * @param  string    field
	 * @param  array     values
	 *
	 * @return this
	 */
	orWhereBetween: function(field, values)
	{
		return this.whereBetween(field, values, 'or');
	},

	/**
	 * Add a not between filter
	 *
	 * @param  string    field
	 * @param  array     values
	 * @param  string    boolean
	 *
	 * @return this
	 */
	whereNotBetween: function(field, values, boolean)
	{
		return this.whereBetween(field, values, boolean || 'and', true);
	},

	/**
	 * Add an or not between filter
	 *
	 * @param  string    field
	 * @param  array     values
	 *
	 * @return this
	 */
	orWhereNotBetween: function(field, values)
	{
		return this.whereNotBetween(field, values, 'or');
	},

	/**
	 * Add an exists filter
	 *
	 * @param  string    field
	 * @param  string    boolean
	 * @param  bool      not
	 *
	 * @return this
	 */
	whereExists: function(field, boolean, not)
	{
		operator = not ? 'not exists' : 'exists';

		return this.where(field, operator, null, boolean || 'and');
	},

	/**
	 * Add an or exists filter
	 *
	 * @param  string    field
	 *
	 * @return this
	 */
	orWhereExists: function(field)
	{
		return this.whereExists(field, 'or');
	},

	/**
	 * Add a not exists filter
	 *
	 * @param  string    field
	 * @param  string    boolean
	 *
	 * @return this
	 */
	whereNotExists: function(field, boolean)
	{
		return this.whereExists(field, boolean || 'and', true);
	},

	/**
	 * Add an or not exists filter
	 *
	 * @param  string    field
	 *
	 * @return this
	 */
	orWhereNotExists: function(field)
	{
		return this.whereNotExists(field, 'or');
	},

	/**
	 * Add an in filter
	 *
	 * @param  string    field
	 * @param  array     values
	 * @param  string    boolean
	 * @param  bool      not
	 *
	 * @return this
	 */
	whereIn: function(field, values, boolean, not)
	{
		operator = not ? 'not in' : 'in';

		return this.where(field, operator, values, boolean || 'and');
	},

	/**
	 * Add an or in filter
	 *
	 * @param  string    field
	 * @param  array     values
	 *
	 * @return this
	 */
	orWhereIn: function(field, values)
	{
		return this.whereIn(field, values, 'or');
	},

	/**
	 * Add a not in filter
	 *
	 * @param  string    field
	 * @param  array     values
	 * @param  string    boolean
	 *
	 * @return this
	 */
	whereNotIn: function(field, values, boolean)
	{
		return this.whereIn(field, values, boolean || 'and', true);
	},

	/**
	 * Add an or not in filter
	 *
	 * @param  string    field
	 * @param  array     values
	 *
	 * @return this
	 */
	orWhereNotIn: function(field, values)
	{
		return this.whereNotIn(field, values, 'or');
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

	/**
	 * Gets a top-level filter by its field name (only retrieves the first match)
	 *
	 * @param  string    key
	 *
	 * @return mixed     //undefined | Filter
	 */
	getFilter: function(key)
	{
		var matchedFilter;

		this.filters.forEach(function(filter)
		{
			if (!matchedFilter && (filter instanceof Filter) && (filter.getField() === key))
			{
				matchedFilter = filter;
			}
		});

		return matchedFilter;
	},

	/**
	 * Gets a top-level filter's value by its field name (only retrieves the first match)
	 *
	 * @param  string    key
	 *
	 * @return mixed
	 */
	getFilterValue: function(key)
	{
		if (filter = this.getFilter(key))
			return filter.getValue();
	},

}

module.exports = FilterSet;