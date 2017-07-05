describe('term invalidation', function()
{
	it("should not allow non-string terms", function()
	{
		var request = new SearchRequest,
			badValues = [['not a string'], 56.4, -5, 45, {}];

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.setTerm(badValue);
			})
			.toThrowError("A search term can only be a string or null.");
		});
	});

});