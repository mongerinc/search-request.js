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

		request.setTerm('search this')
		       .select(['field1', 'field2'])
		       .addSort('something', 'asc').addSort('otherThing', 'desc')
		       .groupBy('something').groupBy('somethingElse')
		       .where('fun', 'more').orWhere(function(filterSet)
		       {
		           filterSet.where('hats', '>', 'large').where('butts', 'small');
		       })
		       .setPage(5).setLimit(50)
		       .facet('something').sortByCount().setSortDirection('desc').setMinimumCount(5).includeOwnFilters().setPage(2).setLimit(100);

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
			selects: ['field1', 'field2'],
			sorts: [
				{field: 'something', direction: 'asc'},
				{field: 'otherThing', direction: 'desc'},
			],
			groups: ['something', 'somethingElse'],
			facets: [
				{
					page: 2,
					limit: 100,
					field: 'something',
					sortType: 'count',
					sortDirection: 'desc',
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