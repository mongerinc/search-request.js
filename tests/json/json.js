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
		       .addSort('something', 'asc').addSort('otherThing', 'desc')
		       .where('fun', 'more').orWhere(function(filterSet)
		       {
		           filterSet.where('hats', '>', 'large').where('butts', 'small');
		       });

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
			sorts: [
				{field: 'something', direction: 'asc'},
				{field: 'otherThing', direction: 'desc'},
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
			}
		});
	}

});