var Sort = require('./sort'),
    Facet = require('./facet'),
    FilterSet = require('./filterSet'),
    isIntegeric = require('./validators/isIntegeric');

function SearchRequest(json)
{
	this.page = 1;
	this.limit = 10;
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
		this.page = inputs.page;
		this.limit = inputs.limit;
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