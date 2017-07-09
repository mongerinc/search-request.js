describe('facet invalidation modification', function()
{
	var facet = (new SearchRequest).facet('someField'),
		badIntegerValues = [null, ['not an integer'], 56.4, -5, 'not an integer'];

	it("should not allow bad sort direction values", function()
	{
		var badValues = [null, ['not a string'], 56.4, -5, 4, 'not a good direction', {}],
		    errorMessage = "The sort direction must be either 'asc' or 'desc'.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				facet.setSortDirection(badValue);
			})
			.toThrowError(errorMessage);
		});
	});

	it("should not allow non-integer pages", function()
	{
		var errorMessage = "A page can only be a positive integer.";

		badIntegerValues.forEach(function(badValue)
		{
			expect(function()
			{
				facet.setPage(badValue);
			})
			.toThrowError(errorMessage);
		});
	});

	it("should not allow non-integer limits", function()
	{
		var errorMessage = "A page row limit can only be a positive integer.";

		badIntegerValues.forEach(function(badValue)
		{
			expect(function()
			{
				facet.setLimit(badValue);
			})
			.toThrowError(errorMessage);
		});
	});

	it("should not allow non-integer minimum counts", function()
	{
		var errorMessage = "The minimum count must be an integer.";

		badIntegerValues.forEach(function(badValue)
		{
			expect(function()
			{
				facet.setMinimumCount(badValue);
			})
			.toThrowError(errorMessage);
		});
	});

});