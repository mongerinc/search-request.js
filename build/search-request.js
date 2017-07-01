(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{"./filter":1,"./validators/isBooleanString":5,"./validators/isOperator":7}],3:[function(require,module,exports){
var Sort = require('./sort'),
    FilterSet = require('./filterSet'),
    isIntegeric = require('./validators/isIntegeric');

function SearchRequest(json)
{
	if (json)
	{
		var inputs = JSON.parse(json);

		this.page = inputs.page;
		this.limit = inputs.limit;
		this.sorts = [];
		this.addSorts(inputs.sorts);
		this.addFilterSet(inputs.filterSet);
	}
	else
	{
		this.page = 1;
		this.limit = 10;
		this.sorts = [];
		this.filterSet = new FilterSet;
	}
}

SearchRequest.prototype = {

	/**
	 * Overrides all sorts and sets the given field/direction as the primary sort
	 *
	 * @param  string    field
	 * @param  string    direction
	 *
	 * @return this
	 */
	sortBy: function(field, direction)
	{
		this.sorts = [new Sort(field, direction)];

		return this;
	},

	/**
	 * Adds a sort onto the existing set
	 *
	 * @param  string    field
	 * @param  string    direction
	 *
	 * @return this
	 */
	addSort: function(field, direction)
	{
		this.sorts.push(new Sort(field, direction));

		return this;
	},

	/**
	 * Adds the sorts from the provided input array
	 *
	 * @param  array    sorts
	 */
	addSorts: function(sorts)
	{
		var self = this;

		if (!Array.isArray(sorts))
			throw new Error("It's only possible to add an array of sorts.");

		sorts.forEach(function(sort)
		{
			self.addSort(sort.field, sort.direction);
		});
	},

	/**
	 * Gets the primary sort
	 *
	 * @return mixed    //null | Sort
	 */
	getSort: function()
	{
		return this.sorts.length ? this.sorts[0] : null;
	},

	/**
	 * Gets all sorts
	 *
	 * @return array
	 */
	getSorts: function()
	{
		return this.sorts;
	},

	/**
	 * Sets the requested page
	 *
	 * @param  int    page
	 *
	 * @return this
	 *
	 * @throws Error
	 */
	setPage: function(page)
	{
		if (!isIntegeric(page) || page <= 0)
			throw new Error("A page can only be a positive integer.");

		this.page = parseInt(page);

		return this;
	},

	/**
	 * Increments the page by one
	 *
	 * @return this
	 */
	nextPage: function()
	{
		this.page++;

		return this;
	},

	/**
	 * Sets the requested page row limit
	 *
	 * @param  int    limit
	 *
	 * @return this
	 *
	 * @throws Error
	 */
	setLimit: function(limit)
	{
		if (!isIntegeric(limit) || limit <= 0)
			throw new Error("A page row limit can only be a positive integer.");

		this.limit = parseInt(limit);

		return this;
	},

	/**
	 * Gets the current page
	 *
	 * @return int
	 */
	getPage: function()
	{
		return this.page;
	},

	/**
	 * Gets the current page row limit
	 *
	 * @return int
	 */
	getLimit: function()
	{
		return this.limit;
	},

	/**
	 * Gets the current number of rows to skip
	 *
	 * @return int
	 */
	getSkip: function()
	{
		return (this.page - 1) * this.limit;
	},

	/**
	 * Gets the top-level filter set
	 *
	 * @return FilterSet
	 */
	getFilterSet: function()
	{
		return this.filterSet;
	},

	/**
	 * Adds the filter set from the provided input array
	 *
	 * @param  object    filterSet
	 */
	addFilterSet: function(filterSet)
	{
		if (typeof filterSet !== 'object')
			throw new Error("A filter set has to be an object.");

		this.filterSet = new FilterSet(filterSet.boolean);

		this.filterSet.addFilters(filterSet.filters);
	},

	/**
	 * Convert the search request to a json string
	 *
	 * @return string
	 */
	toJson: function()
	{
		return JSON.stringify(this);
	}

};

var filterPassThroughMethods = [
	'where', 'orWhere',
	'whereBetween', 'orWhereBetween', 'whereNotBetween', 'orWhereNotBetween',
	'whereExists', 'orWhereExists', 'whereNotExists', 'orWhereNotExists',
	'whereIn', 'orWhereIn', 'whereNotIn', 'orWhereNotIn',
	'getFilter', 'getFilterValue'
];

filterPassThroughMethods.forEach(function(method)
{
	SearchRequest.prototype[method] = function()
	{
		this.filterSet[method].apply(this.filterSet, arguments);

		return this;
	}
});

window.SearchRequest = SearchRequest;
},{"./filterSet":2,"./sort":4,"./validators/isIntegeric":6}],4:[function(require,module,exports){
function Sort(field, direction)
{
	if (typeof field !== 'string')
		throw new Error("The sort field should be a string.");

	if (['asc', 'desc'].indexOf(direction) === -1)
		throw new Error("The sort direction should either 'asc' or 'desc'.");

	this.field = field;
	this.direction = direction;
}

Sort.prototype = {

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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}]},{},[3]);
