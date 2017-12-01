describe('facet', function()
{
	var request;

	beforeEach(function()
	{
		request = new SearchRequest;
	});

	it("should have defaults set", function()
	{
		var facet = request.facet('someField');

		expect(facet.isValueSorting()).toBe(true);
		expect(facet.isCountSorting()).toBe(false);
		expect(facet.getSortDirection()).toBe('asc');
		expect(facet.getPage()).toBe(1);
		expect(facet.getLimit()).toBe(10);
		expect(facet.getMinimumCount()).toBe(1);
		expect(facet.shouldExcludeOwnFilters()).toBe(true);
	});

	it("should sort", function()
	{
		var facet = request.facet('someField');

		facet.sortByCount();
		expect(facet.isValueSorting()).toBe(false);
		expect(facet.isCountSorting()).toBe(true);

		facet.sortByValue();
		expect(facet.isValueSorting()).toBe(true);
		expect(facet.isCountSorting()).toBe(false);

		facet.setSortDirection('asc');
		expect(facet.getSortDirection()).toBe('asc');

		facet.setSortDirection('desc');
		expect(facet.getSortDirection()).toBe('desc');
	});

	it("should paginate", function()
	{
		var facet = request.facet('someField');

		facet.setPage(5).setLimit(25);
		expect(facet.getPage()).toBe(5);
		expect(facet.getLimit()).toBe(25);

		facet.nextPage();
		expect(facet.getPage()).toBe(6);
	});

	it("should change minimum count", function()
	{
		var facet = request.facet('someField').setMinimumCount(5);

		expect(facet.getMinimumCount(), 5);
	});

	it("should modify exclude own filters", function()
	{
		var facet = request.facet('someField').setMinimumCount(5);

		facet.excludeOwnFilters();
		expect(facet.shouldExcludeOwnFilters()).toBe(true);

		facet.includeOwnFilters();
		expect(facet.shouldExcludeOwnFilters()).toBe(false);
	});

	it("should add many facets at once", function()
	{
		request.facetMany(['someField', 'someOtherField']);

		expect(request.getFacets()).toEqual([
			{
				field: 'someField',
				sortType: 'value',
				sortDirection: 'asc',
				page: 1,
				limit: 10,
				minimumCount: 1,
				excludesOwnFilters: true,
			},
			{
				field: 'someOtherField',
				sortType: 'value',
				sortDirection: 'asc',
				page: 1,
				limit: 10,
				minimumCount: 1,
				excludesOwnFilters: true,
			},
		]);
	});

	it("should get facet by name", function()
	{
		request.facetMany(['someField', 'someOtherField']);

		expect(request.getFacet('someOtherField')).toEqual({
			field: 'someOtherField',
			sortType: 'value',
			sortDirection: 'asc',
			page: 1,
			limit: 10,
			minimumCount: 1,
			excludesOwnFilters: true,
		});
	});

	it("should reset page by default", function()
	{
		var facet = request.facet('someField');

		facet.setPage(5).sortByCount();
		expect(facet.getPage()).toEqual(1);

		facet.setPage(5).sortByValue();
		expect(facet.getPage()).toEqual(1);

		facet.setPage(5).setMinimumCount(5);
		expect(facet.getPage()).toEqual(1);

		facet.setPage(5).excludeOwnFilters();
		expect(facet.getPage()).toEqual(1);

		facet.setPage(5).includeOwnFilters();
		expect(facet.getPage()).toEqual(1);
	});

	it("should not reset page when disabled", function()
	{
		var facet = request.facet('someField').disableAutomaticPageReset();

		facet.setPage(5).sortByCount();
		expect(facet.getPage()).toEqual(5);

		facet.setPage(5).sortByValue();
		expect(facet.getPage()).toEqual(5);

		facet.setPage(5).setMinimumCount(5);
		expect(facet.getPage()).toEqual(5);

		facet.setPage(5).excludeOwnFilters();
		expect(facet.getPage()).toEqual(5);

		facet.setPage(5).includeOwnFilters();
		expect(facet.getPage()).toEqual(5);
	});

	it("should reset page when reenabled", function()
	{
		var facet = request.facet('someField').disableAutomaticPageReset().enableAutomaticPageReset();

		facet.setPage(5).sortByCount();
		expect(facet.getPage()).toEqual(1);
	});

});