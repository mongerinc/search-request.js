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