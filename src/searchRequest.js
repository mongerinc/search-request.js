var Sort = require('./sort'),
    Facet = require('./facet'),
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
		this.facets = [];
		this.addFacets(inputs.facets);
		this.addFilterSet(inputs.filterSet);
	}
	else
	{
		this.page = 1;
		this.limit = 10;
		this.term = null;
		this.sorts = [];
		this.facets = [];
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
		if (typeof term !== 'string' && term !== null)
			throw new Error("A search term can only be a string or null.");

		this.term = term;

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
	}

};

var filterPassThroughMethods = [
	'where', 'orWhere',
	'whereBetween', 'orWhereBetween', 'whereNotBetween', 'orWhereNotBetween',
	'whereExists', 'orWhereExists', 'whereNotExists', 'orWhereNotExists',
	'whereIn', 'orWhereIn', 'whereNotIn', 'orWhereNotIn',
	'whereLike', 'orWhereLike', 'whereNotLike', 'orWhereNotLike',
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