describe('facet invalidation creation', function()
{
	var request = new SearchRequest;

	it("should not allow bad facet field values", function()
	{
		var badValues = [null, ['not a string'], 56.4, -5, 4, {}],
		    errorMessage = "The facet field must be a string.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.facet(badValue);
			})
			.toThrowError(errorMessage);

			expect(function()
			{
				request.facetMany([{field: badValue}]);
			})
			.toThrowError(errorMessage);
		});
	});

	it("should not allow non-array multiple facets", function()
	{
		var badValues = [null, 56.4, -5, 4, 'not an array', {}],
		    errorMessage = "Adding many facets must be done with an array.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.facetMany(badValue);
			})
			.toThrowError(errorMessage);
		});
	});

});