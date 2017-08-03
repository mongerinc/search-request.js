describe('select invalidation', function()
{
	it("should not allow non-string select fields", function()
	{
		var request = new SearchRequest,
			badValues = [56.4, -5, 45, {}, [1], [{}]];

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.select(badValue);
			})
			.toThrowError("A select field must be a string or an array of strings.");
		});

		badValues.forEach(function(badValue)
		{
			expect(function()
			{
				request.addSelect(badValue);
			})
			.toThrowError("A select field must be a string or an array of strings.");
		});
	});

});