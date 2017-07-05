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
		this.term = inputs.term;
		this.sorts = [];
		this.addSorts(inputs.sorts);
		this.addFilterSet(inputs.filterSet);
	}
	else
	{
		this.page = 1;
		this.limit = 10;
		this.term = null;
		this.sorts = [];
		this.filterSet = new FilterSet;
	}
}

SearchRequest.prototype = {

	/**
	 * Sets the global search term
	 *
	 * @param  string    term
	 *
	 * @return this
	 */
	setTerm: function(term)
	{
		this.term = term;

		return this;
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