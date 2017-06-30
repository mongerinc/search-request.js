describe('pagination invalidation', function()
{
	var badValues = [null, ['not an integer'], 56.4, -5, 'not an integer'];

	it("should not allow non-integer pages", function()
	{
		var request = new SearchRequest,
			errorMessage = "A page can only be a positive integer.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.setPage(badValue);
			})
			.toThrowError(errorMessage);
		});
	});

	it("should not allow non-integer limits", function()
	{
		var request = new SearchRequest,
			errorMessage = "A page row limit can only be a positive integer.";

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.setLimit(badValue);
			})
			.toThrowError(errorMessage);
		});
	});

});