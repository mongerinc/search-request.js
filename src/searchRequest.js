var Sort = require('./sort'),
    Filter = require('./filter'),
    FilterSet = require('./filterSet');

function SearchRequest(json)
{
	if (json)
	{
		var inputs = JSON.parse(json);

		this.page = inputs.page;
		this.limit = inputs.limit;
	}
}

SearchRequest.prototype = {

	sorts: [],
	page: 1,
	limit: 10,
	filterSet: new FilterSet,

	/**
	 * Adds the sorts from the provided input array
	 *
	 * @param  array    sorts
	 */
	addSortsFromArray: function(sorts)
	{
		var self = this;

		sorts.forEach(function(sort)
		{
			self.addSort(sort.field, sort.direction);
		});
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

};

/**
 * Determines if the provided value is integer-like
 *
 * @param  mixed    value
 *
 * @return bool
 */
function isIntegeric(value)
{
	return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

window.SearchRequest = SearchRequest;