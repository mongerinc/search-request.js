describe('sort invalidation', function()
{
	var request = new SearchRequest;

	it("should not allow bad sort field values", function()
	{
		var badValues = [null, ['not a string'], 56.4, -5, 4, {}],
		    errorMessage = "The sort field should be a string.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.sortBy(badValue, 'asc');
			})
			.toThrowError(errorMessage);

			expect(function()
			{
				request.addSort(badValue, 'asc');
			})
			.toThrowError(errorMessage);

			expect(function()
			{
				request.addSorts([{field: badValue, direction: 'asc'}]);
			})
			.toThrowError(errorMessage);
		});
	});

	it("should not allow bad sort direction values", function()
	{
		var badValues = [null, ['not a string'], 56.4, -5, 4, 'not a good direction', {}],
		    errorMessage = "The sort direction should either 'asc' or 'desc'.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.sortBy('field', badValue);
			})
			.toThrowError(errorMessage);

			expect(function()
			{
				request.addSort('field', badValue);
			})
			.toThrowError(errorMessage);

			expect(function()
			{
				request.addSorts([{field: 'field', direction: badValue}]);
			})
			.toThrowError(errorMessage);
		});
	});

	if("should not allow non-array multiple sorts", function()
	{
		var badValues = [null, 56.4, -5, 4, 'not an array', {}],
		    errorMessage = "It's only possible to add an array of sorts.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.addSorts(badValue);
			})
			.toThrowError(errorMessage);
		});
	});

});