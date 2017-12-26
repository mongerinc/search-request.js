(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var isIntegeric = require('./validators/isIntegeric');

function Facet(values)
{
	if (!values || typeof values !== 'object')
		throw new Error("A Facet object must be instantiated with an object of input values.");

	this.page = 1;
	this.limit = 10;

	this.setField(values.field);
	this.setSortType(values.hasOwnProperty('sortType') ? values.sortType : 'value');
	this.setSortDirection(values.hasOwnProperty('sortDirection') ? values.sortDirection : 'asc');
	this.setMinimumCount(values.hasOwnProperty('minimumCount') ? values.minimumCount : 1);
	this.setExcludesOwnFilters(values.hasOwnProperty('excludesOwnFilters') ? values.excludesOwnFilters : true);
	this.setPage(values.hasOwnProperty('page') ? values.page : this.page);
	this.setLimit(values.hasOwnProperty('limit') ? values.limit : this.limit);
}

Facet.prototype = {

	/**
	 * Determines if the page should reset when filter/sort changes
	 *
	 * @var bool
	 */
	pageShouldAutomaticallyReset: true,

	/**
	 * @return string
	 */
	getField: function()
	{
		return this.field;
	},

	/**
	 * @return bool
	 */
	isCountSorting: function()
	{
		return this.sortType === 'count';
	},

	/**
	 * @return bool
	 */
	isValueSorting: function()
	{
		return this.sortType === 'value';
	},

	/**
	 * @return string
	 */
	getSortDirection: function()
	{
		return this.sortDirection;
	},

	/**
	 * @return int
	 */
	getPage: function()
	{
		return this.page;
	},

	/**
	 * @return int
	 */
	getLimit: function()
	{
		return this.limit;
	},

	/**
	 * @return int
	 */
	getSkip: function()
	{
		return (this.page - 1) * this.limit;
	},

	/**
	 * @return int
	 */
	getMinimumCount: function()
	{
		return this.minimumCount;
	},

	/**
	 * @return bool
	 */
	shouldExcludeOwnFilters: function()
	{
		return this.excludesOwnFilters;
	},

	/**
	 * Sets the field
	 *
	 * @param  string    field
	 *
	 * @return this
	 */
	setField: function(field)
	{
		if (typeof field !== 'string')
		{
			throw new Error("The facet field must be a string.");
		}

		this.field = field;

		return this;
	},

	/**
	 * @return this
	 */
	sortByCount: function()
	{
		return this.setSortType('count');
	},

	/**
	 * @return this
	 */
	sortByValue: function()
	{
		return this.setSortType('value');
	},

	/**
	 * @param  string    type
	 *
	 * @return this
	 */
	setSortType: function(type)
	{
		if (['count', 'value'].indexOf(type) === -1)
			throw new Error("The facet sort type should be either 'count' or 'value'.");

		this.sortType = type;

		if (this.pageShouldAutomaticallyReset)
			this.setPage(1);

		return this;
	},

	/**
	 * @param  string    direction
	 *
	 * @return this
	 */
	setSortDirection: function(direction)
	{
		if (['asc', 'desc'].indexOf(direction) === -1)
			throw new Error("The sort direction must be either 'asc' or 'desc'.");

		this.sortDirection = direction;

		if (this.pageShouldAutomaticallyReset)
			this.setPage(1);

		return this;
	},

	/**
	 * @param  int    page
	 *
	 * @return this
	 */
	setPage: function(page)
	{
		if (!isIntegeric(page) || page <= 0)
			throw new Error("A page can only be a positive integer.");

		this.page = parseInt(page);

		return this;
	},

	/**
	 * @return this
	 */
	nextPage: function()
	{
		this.page++;

		return this;
	},

	/**
	 * @param  int    limit
	 *
	 * @return this
	 */
	setLimit: function(limit)
	{
		if (!isIntegeric(limit) || limit <= 0)
			throw new Error("A page row limit can only be a positive integer.");

		this.limit = parseInt(limit);

		return this;
	},

	/**
	 * @param  int    minimumCount
	 *
	 * @return this
	 */
	setMinimumCount: function(minimumCount)
	{
		if (!isIntegeric(minimumCount) || (minimumCount < 0))
			throw new Error("The minimum count must be an integer.");

		this.minimumCount = parseInt(minimumCount);

		if (this.pageShouldAutomaticallyReset)
			this.setPage(1);

		return this;
	},

	/**
	 * @return this
	 */
	excludeOwnFilters: function()
	{
		return this.setExcludesOwnFilters(true);
	},

	/**
	 * @return this
	 */
	includeOwnFilters: function()
	{
		return this.setExcludesOwnFilters(false);
	},

	/**
	 * @param  bool    value
	 *
	 * @return this
	 */
	setExcludesOwnFilters: function(value)
	{
		this.excludesOwnFilters = !!value;

		if (this.pageShouldAutomaticallyReset)
			this.setPage(1);

		return this;
	},

	/**
	 * Disables automatic page resetting
	 *
	 * @return this
	 */
	disableAutomaticPageReset: function()
	{
		this.pageShouldAutomaticallyReset = false;

		return this;
	},

	/**
	 * Enables automatic page resetting
	 *
	 * @return this
	 */
	enableAutomaticPageReset: function()
	{
		this.pageShouldAutomaticallyReset = true;

		return this;
	},

}

module.exports = Facet;
},{"./validators/isIntegeric":7}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
	 * Add a like filter
	 *
	 * @param  string    field
	 * @param  string    value
	 * @param  string    boolean
	 * @param  bool      not
	 *
	 * @return this
	 */
	whereLike: function(field, value, boolean, not)
	{
		operator = not ? 'not like' : 'like';

		return this.where(field, operator, value, boolean || 'and');
	},

	/**
	 * Add an or like filter
	 *
	 * @param  string    field
	 * @param  string    value
	 *
	 * @return this
	 */
	orWhereLike: function(field, value)
	{
		return this.whereLike(field, value, 'or');
	},

	/**
	 * Add a not like filter
	 *
	 * @param  string    field
	 * @param  string    value
	 * @param  string    boolean
	 *
	 * @return this
	 */
	whereNotLike: function(field, value, boolean)
	{
		return this.whereLike(field, value, boolean || 'and', true);
	},

	/**
	 * Add an or not like filter
	 *
	 * @param  string    field
	 * @param  string    value
	 *
	 * @return this
	 */
	orWhereNotLike: function(field, value)
	{
		return this.whereNotLike(field, value, 'or');
	},

	/**
	 * Add a regex filter
	 *
	 * @param  string    field
	 * @param  string    value
	 * @param  string    boolean
	 * @param  bool      not
	 *
	 * @return this
	 */
	whereRegex: function(field, value, boolean, not)
	{
		operator = not ? 'not regex' : 'regex';

		return this.where(field, operator, value, boolean || 'and');
	},

	/**
	 * Add an or regex filter
	 *
	 * @param  string    field
	 * @param  string    value
	 *
	 * @return this
	 */
	orWhereRegex: function(field, value)
	{
		return this.whereRegex(field, value, 'or');
	},

	/**
	 * Add a not regex filter
	 *
	 * @param  string    field
	 * @param  string    value
	 * @param  string    boolean
	 *
	 * @return this
	 */
	whereNotRegex: function(field, value, boolean)
	{
		return this.whereRegex(field, value, boolean || 'and', true);
	},

	/**
	 * Add an or not regex filter
	 *
	 * @param  string    field
	 * @param  string    value
	 *
	 * @return this
	 */
	orWhereNotRegex: function(field, value)
	{
		return this.whereNotRegex(field, value, 'or');
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

	/**
	 * Removes all instances of the filter with the provided field name(s)
	 *
	 * @param  mixed    key
	 *
	 * @return $this
	 */
	removeFilters: function(key)
	{
		var newFilters = []
		    keys = [].concat(key);

		this.filters.forEach(function(filter)
		{
			if (!(filter instanceof Filter) || (keys.indexOf(filter.getField())) === -1)
			{
				newFilters.push(filter);
			}
		});

		this.filters = newFilters;

		return this;
	},

	/**
	 * Substitutes all field names in the filter set that match the provided substitution
	 *
	 * @param  string    original
	 * @param  string    substitution
	 */
	substituteField: function(original, substitution)
	{
		this.filters.forEach(function(filter)
		{
			if (!filter.filters && (filter.field === original))
			{
				filter.field = substitution;
			}
			else if (filter.filters)
			{
				filter.substituteField(original, substitution);
			}
		})
	}

}

module.exports = FilterSet;
},{"./filter":2,"./validators/isBooleanString":6,"./validators/isOperator":8}],4:[function(require,module,exports){
var Sort = require('./sort'),
    Facet = require('./facet'),
    FilterSet = require('./filterSet'),
    isIntegeric = require('./validators/isIntegeric');

function SearchRequest(json)
{
	this.page = 1;
	this.limit = 10;
	this.unlimited = false;
	this.term = null;
	this.selects = [];
	this.sorts = [];
	this.groups = [];
	this.facets = [];
	this.filterSet = new FilterSet;

	if (json)
	{
		var inputs = JSON.parse(json);

		this.term = inputs.term;
		this.selects = inputs.selects;
		this.sorts = [];
		this.addSorts(inputs.sorts);
		this.groups = [];
		this.groupBy(inputs.groups);
		this.facets = [];
		this.addFacets(inputs.facets);
		this.addFilterSet(inputs.filterSet);
		this.setPage(inputs.page);
		this.setLimit(inputs.limit);
		this.unlimited = inputs.unlimited || false;
	}
}

SearchRequest.prototype = {

	/**
	 * Determines if the page should reset when filter/group/sort changes
	 *
	 * @var bool
	 */
	pageShouldAutomaticallyReset: true,

	/**
	 * Sets the global search term
	 *
	 * @param  string    term
	 *
	 * @return this
	 */
	setTerm: function(term)
	{
		if (typeof term !== 'string' && term !== null)
			throw new Error("A search term can only be a string or null.");

		this.term = term;

		if (this.pageShouldAutomaticallyReset)
			this.setPage(1);

		return this;
	},

	/**
	 * Gets the search term
	 *
	 * @return mixed
	 */
	getTerm: function()
	{
		return this.term;
	},

	/**
	 * Set the selects
	 *
	 * @param  mixed    field
	 *
	 * @return this
	 */
	select: function(field)
	{
		if (!Array.isArray(field))
			field = [field];

		//clear the selects
		this.selects = [];

		for (var i = 0; i < field.length; i++)
		{
			this.addSelect(field[i]);
		}

		return this;
	},

	/**
	 * Add a select
	 *
	 * @param  mixed    field
	 *
	 * @return this
	 */
	addSelect: function(field)
	{
		if (typeof field !== 'string' && !Array.isArray(field))
			throw new Error("A select field must be a string or an array of strings.");

		if (!Array.isArray(field))
			field = [field];

		for (var i = 0; i < field.length; i++)
		{
			if (typeof field[i] !== 'string')
			{
				throw new Error("A select field must be a string or an array of strings.");
			}

			this.selects.push(field[i]);
		}

		return this;
	},

	/**
	 * Get the selects
	 *
	 * @return array
	 */
	getSelects: function()
	{
		return this.selects;
	},

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
		this.sorts = [];

		this.addSort(field, direction);

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

		if (this.pageShouldAutomaticallyReset)
			this.setPage(1);

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
	 * Adds grouping for the given field(s)
	 *
	 * @param  mixed  field
	 */
	groupBy: function(field)
	{
		if (!Array.isArray(field))
			field = [field];

		for (var i = 0; i < field.length; i++)
		{
			if (typeof field[i] !== 'string')
			{
				throw new Error("It's only possible to add a string or an array of strings of groups.");
			}

			this.groups.push(field[i]);
		}

		if (this.pageShouldAutomaticallyReset)
			this.setPage(1);

		return this;
	},

	/**
	 * Gets all groups
	 *
	 * @return array
	 */
	getGroups: function()
	{
		return this.groups;
	},

	/**
	 * Add a facet
	 *
	 * @param  string    field
	 *
	 * @return Facet
	 */
	facet: function(field)
	{
		var facet = new Facet({field: field});

		this.facets.push(facet);

		return facet;
	},

	/**
	 * Add a facet
	 *
	 * @param  string    field
	 *
	 * @return this
	 */
	facetMany: function(fields)
	{
		var self = this;

		if (!Array.isArray(fields))
			throw new Error("Adding many facets must be done with an array.");

		fields.forEach(function(field)
		{
			self.facet(field);
		});

		return this;
	},

	/**
	 * Adds a group of facets
	 *
	 * @param  array    facets
	 *
	 * @return this
	 */
	addFacets: function(facets)
	{
		var self = this;

		if (!Array.isArray(facets))
			throw new Error("Adding many facets must be done with an array.");

		facets.forEach(function(facet)
		{
			self.facets.push(new Facet(facet));
		});
	},

	/**
	 * Gets the facet for the provided field
	 *
	 * @param  string    field
	 *
	 * @return mixed    //null | Facet
	 */
	getFacet: function(field)
	{
		for (var i = 0; i < this.facets.length; i++)
		{
			if (this.facets[i].getField() === field)
			{
				return this.facets[i];
			}
		}
	},

	/**
	 * Gets all facets
	 *
	 * @return array
	 */
	getFacets: function()
	{
		return this.facets;
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
		this.unlimited = false;

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
		this.unlimited = false;

		return this;
	},

	/**
	 * Sets the unlimited flag
	 *
	 * @param  bool    unlimited
	 *
	 * @return this
	 */
	setUnlimited: function(unlimited)
	{
		this.unlimited = unlimited === false ? false : true;

		return this;
	},

	/**
	 * Alias for calling unlimited with true
	 *
	 * @return this
	 */
	all: function()
	{
		return this.setUnlimited(true);
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
	 * Gets the unlimited flag
	 *
	 * @return bool
	 */
	isUnlimited: function()
	{
		return this.unlimited;
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
	 * Disables automatic page resetting
	 *
	 * @return this
	 */
	disableAutomaticPageReset: function()
	{
		this.pageShouldAutomaticallyReset = false;

		return this;
	},

	/**
	 * Enables automatic page resetting
	 *
	 * @return this
	 */
	enableAutomaticPageReset: function()
	{
		this.pageShouldAutomaticallyReset = true;

		return this;
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
	 * Substitutes all field names in the request that match the provided set of substitutions
	 *
	 * @param  object    substitutions
	 */
	substituteFields: function(substitutions)
	{
		if (typeof substitutions !== 'object')
			throw new Error("Multiple field substitutions require an object mapping original to substitution strings.");

		for (var original in substitutions)
		{
			if (substitutions.hasOwnProperty(original))
			{
				this.substituteField(original, substitutions[original]);
			}
		}
	},

	/**
	 * Substitutes all field names in the request that match the provided substitution
	 *
	 * @param  string    original
	 * @param  string    substitution
	 */
	substituteField: function(original, substitution)
	{
		if ((typeof original !== 'string') || (typeof substitution !== 'string'))
			throw new Error("Field subtitutions must consist of an original string and a substitution string.");

		this.sorts.forEach(function(sort)
		{
			if (sort.field === original)
			{
				sort.field = substitution;
			}
		});

		this.facets.forEach(function(facet)
		{
			if (facet.field === original)
			{
				facet.setField(substitution);
			}
		});

		this.selects.forEach(function(field, index, array)
		{
			if (field === original)
			{
				array[index] = substitution;
			}
		});

		this.groups.forEach(function(field, index, array)
		{
			if (field === original)
			{
				array[index] = substitution;
			}
		});

		this.filterSet.substituteField(original, substitution);
	},

	/**
	 * Convert the search request to a json string
	 *
	 * @return string
	 */
	toJson: function()
	{
		return JSON.stringify(this);
	},

	/**
	 * Deep-clones the search request
	 *
	 * @return SearchRequest
	 */
	clone: function()
	{
		return new SearchRequest(this.toJson());
	},

};

var filterPassThroughMethods = [
	'where', 'orWhere',
	'whereBetween', 'orWhereBetween', 'whereNotBetween', 'orWhereNotBetween',
	'whereExists', 'orWhereExists', 'whereNotExists', 'orWhereNotExists',
	'whereIn', 'orWhereIn', 'whereNotIn', 'orWhereNotIn',
	'whereLike', 'orWhereLike', 'whereNotLike', 'orWhereNotLike',
	'whereRegex', 'orWhereRegex', 'whereNotRegex', 'orWhereNotRegex',
	'getFilter', 'getFilterValue',
	'removeFilters'
];

filterPassThroughMethods.forEach(function(method)
{
	SearchRequest.prototype[method] = function()
	{
		var response = this.filterSet[method].apply(this.filterSet, arguments);

		if (method.indexOf('get') !== -1)
			return response;

		if ((method.toLowerCase().indexOf('where') !== -1) && this.pageShouldAutomaticallyReset)
			this.setPage(1);

		return this;
	}
});

window.SearchRequest = SearchRequest;
},{"./facet":1,"./filterSet":3,"./sort":5,"./validators/isIntegeric":7}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
/**
 * Determines if the provided value is one of the valid operators
 *
 * @param  mixed    value
 *
 * @return bool
 */
module.exports = function(value)
{
	var operators = ['=', '>', '>=', '<', '<=', '!=', 'in', 'not in', 'like', 'not like', 'regex', 'not regex', 'exists', 'not exists', 'between', 'not between'];

	return operators.indexOf(value) !== -1;
};
},{}]},{},[4]);
