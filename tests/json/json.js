describe('json', function()
{
	it("should convert to json", function()
	{
		expect(buildExpectedRequest().toJson()).toBe(buildExpectedJson());
	});

	it("should build from json", function()
	{
		var request = new SearchRequest(buildExpectedJson());

		expect(request).toEqual(buildExpectedRequest());
	});

	/**
	 * Builds the expected search request
	 *
	 * @return SearchRequest
	 */
	function buildExpectedRequest()
	{
		var request = new SearchRequest;

		request.setPage(5).setLimit(50)
		       .setTerm('search this')
		       .addSort('something', 'asc').addSort('otherThing', 'desc')
		       .where('fun', 'more').orWhere(function(filterSet)
		       {
		           filterSet.where('hats', '>', 'large').where('butts', 'small');
		       })
		       .facet('something').setPage(2).setLimit(100).sortByCount().setSortDirection('desc').setMinimumCount(5).includeOwnFilters();

		return request;
	}

	/**
	 * Builds the expected json strong
	 *
	 * @return string
	 */
	function buildExpectedJson()
	{
		return JSON.stringify({
			page: 5,
			limit: 50,
			term: 'search this',
			sorts: [
				{field: 'something', direction: 'asc'},
				{field: 'otherThing', direction: 'desc'},
			],
			facets: [
				{
					field: 'something',
					sortType: 'count',
					sortDirection: 'desc',
					page: 2,
					limit: 100,
					minimumCount: 5,
					excludesOwnFilters: false,
				}
			],
			filterSet: {
				boolean: 'and',
				filters: [
					{field: 'fun', operator: '=', value: 'more', boolean: 'and'},
					{
						boolean: 'or',
						filters: [
							{field: 'hats', operator: '>', value: 'large', boolean: 'and'},
							{field: 'butts', operator: '=', value: 'small', boolean: 'and'},
						]
					}
				]
			},
		});
	}

});