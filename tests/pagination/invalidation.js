describe('pagination invalidation', function()
{
	var request,
		badValues = [null, ['not an integer'], 56.4, -5, 'not an integer'];

	beforeEach(function()
	{
		request = new SearchRequest;
	});

	it("should not allow non-integer pages", function()
	{
		var errorMessage = "A page can only be a positive integer.";

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
		var errorMessage = "A page row limit can only be a positive integer.";

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